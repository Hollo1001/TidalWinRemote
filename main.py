import sys
from optparse import OptionParser
import requests
import json
import socket
import subprocess
import time
import websocket
import json
import socket
import os
import sys
import logging
from flask import Flask, render_template, request, redirect, url_for, send_from_directory, jsonify
from flask_cors import CORS

logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)
logger.disabled = True
app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})
erb = None
song_data = {}

@app.route('/')
def index():
    # Serve the HTML interface for controlling the player
    return render_template('index.html')

@app.route('/send_command', methods=['POST'])
def send_command():
    print(request.json)
    command = request.json.get('command')
    if command:
        result = handle_command(command)
        print(f"Command '{command}' sent. Result: {result}")
        return jsonify({'result': result})
    return jsonify({'error': 'No command provided'}), 400


@app.route('/api/song', methods=['GET', 'POST'])
def current_song():
    if request.method == 'POST':
        # Update the current song with data from the Tidal app
        global song_data
        song_data = request.json
        #print(song_data)  # Just for debugging
        return jsonify({'status': 'Song updated'})
    else:
        # Get the current song data
        return jsonify(song_data)

@app.route('/api/playlist', methods=['GET', 'POST'])
def playlist():
    # Endpoint for getting or updating the playlist
    if request.method == 'POST':
        # Update the playlist with data from the Tidal app
        playlist_data = request.json
        # Process the playlist_data as needed
        return jsonify({'status': 'Playlist updated'})
    else:
        # Get the current playlist data
        playlist_data = {}  # Replace with actual data retrieval logic
        return jsonify(playlist_data)
    
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

def handle_command(command):
    # This function would interact with the Tidal app through the ElectronRemoteDebugger
    # It should send the appropriate JavaScript to the Tidal app to perform the action
    # associated with the command. The response from the Tidal app should be processed
    # and returned to the caller.
    print("Received Command: "+ command)
    for w in (_ for _ in erb.windows()):
        print(w)
        try:
            erb.eval(w, command)

        except Exception as e:
            logger.exception(e)





class LazyWebsocket(object):
    def __init__(self, url):
        self.url = url
        self.ws = None

    def _connect(self):
        if not self.ws:
            self.ws = websocket.create_connection(self.url)
        return self.ws

    def send(self, *args, **kwargs):
        return self._connect().send(*args, **kwargs)

    def recv(self, *args, **kwargs):
        return self.ws.recv(*args, **kwargs)

    def sendrcv(self, msg):
        self.send(msg)
        return self.recv()

    def close(self):
        self.ws.close()

class ElectronRemoteDebugger(object):
    def __init__(self, host, port):
        self.params = {'host': host, 'port': port}

    def windows(self):
        params = self.params.copy()
        params.update({'ts': int(time.time())})

        ret = []
        for w in self.requests_get("http://%(host)s:%(port)s/json/list?t=%(ts)d" % params).json():
            url = w.get("webSocketDebuggerUrl")
            if not url:
                continue
            w['ws'] = LazyWebsocket(url)
            ret.append(w)
        return ret

    def requests_get(self, url, tries=5, delay=1):
        last_exception = Exception("failed to request after %d tries."%tries)
        for _ in range(tries):
            try:
                return requests.get(url)
            except requests.exceptions.ConnectionError as ce:
                # ignore it
                last_exception = ce
            time.sleep(delay)
        raise last_exception


    def sendrcv(self, w, msg):
        return w['ws'].sendrcv(msg)

    def eval(self, w, expression):

        data = {'id': 1,
                'method': "Runtime.evaluate",
                'params': {'contextId': 1,
                           'doNotPauseOnExceptionsAndMuteConsole': False,
                           'expression': expression,
                           'generatePreview': False,
                           'includeCommandLineAPI': True,
                           'objectGroup': 'console',
                           'returnByValue': False,
                           'userGesture': True}}

        ret = json.loads(w['ws'].sendrcv(json.dumps(data)))
        if "result" not in ret:
            return ret
        if ret['result'].get('wasThrown'):
            raise Exception(ret['result']['result'])
        return ret['result']

    @classmethod
    def execute(cls, path, port=None):
        if port is None:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.bind(('', 0))
            port = sock.getsockname()[1]
            sock.close()

        cmd = "%s %s" % (path, "--remote-debugging-port=%d" % port)
        print (cmd)
        p = subprocess.Popen(cmd, shell=True)
        time.sleep(0.5)
        if p.poll() is not None:
            raise Exception("Could not execute cmd (not found or already running?): %r"%cmd)

        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        for _ in range(30):
            result = sock.connect_ex(('localhost', port))
            if result > 0:
                break
            time.sleep(1)
        return cls("localhost", port=port)

def init(target):
    global erb
    erb = ElectronRemoteDebugger.execute(target, None)
    windows_visited = set()
    while True:
        for w in (_ for _ in erb.windows() if _.get('id') not in windows_visited):
            try:
                with open("script.js", "r") as file:
                    script = file.read()
                    erb.eval(w, script)

            except Exception as e:
                logger.exception(e)
            finally:
                # patch windows only once
                windows_visited.add(w.get('id'))

        if all(w.get('id') in windows_visited for w in erb.windows()):
            break

def run_server():
    app.run(host='0.0.0.0', port=5000, debug=False)

if __name__ == "__main__":
    target = "%LOCALAPPDATA%\TIDAL\TIDAL.exe"
    os.system("taskkill /F /im TIDAL.exe")
    init(target)
    run_server()

"""
TidalClearPlayQueue()
var footerPlayer = document.getElementById('footerPlayer');
var PlayButton = document.evaluate(".//button[@aria-label='Pause']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue || document.evaluate(".//button[@aria-label='Play']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var NextButton = document.evaluate(".//button[@aria-label='Next']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var PreviousButton = document.evaluate(".//button[@aria-label='Previous']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var PreviousButton = document.evaluate(".//button[@aria-label='Shuffle']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var PreviousButton = document.evaluate(".//button[@aria-label='Repeat']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var LikeButton = document.evaluate(".//button[@aria-label='Add to My Collection']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
"""