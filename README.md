# Tidal Remote Control

This project provides a remote control interface for the Tidal music streaming service. It uses a Flask server to provide a web interface that can send commands to the Tidal desktop app.

![image](https://github.com/Hollo1001/TidalWinRemote/assets/13909138/5e1fbed4-7e60-4656-ac24-297c2c8624a7)

## Setup
0. Have Tidal Windows App Installed
1. Clone this repository.
2. Install the required Python packages using pip:

    ```sh
    pip install -r requirements.txt
    ```

3. Run the Flask server:

    ```sh
    python main.py
    ```

4. Open a web browser and navigate to `http://localhost:5000`.

## Usage
The web interface provides buttons for play/pause, next track, and previous track.
You can also view the current song and playlist.

## To-Do
- Volume control.
- Search functionality.
- Seeking in a song.
- Playlist support.
- Queue support.
- Search Completion.
- Add all control elements.
- Discord Rich Presence.
- Settings.
- Responsive UI.
- Improve error handling.

## Motivation

As a user of Tidal, I've recognized a significant gap in its functionality compared to some of its competitors like Spotify. Tidal is renowned for its high-quality audio, but it lacks the ability to control playback on a PC remotely from another device. This feature is especially vital for audiophiles and those with advanced audio setups who prefer to manage their music without being physically present at their computer.

A few years ago, Tidal announced plans to introduce remote playback control. However, this feature never came to fruition and was subsequently removed from their upcoming features list. This absence has left a noticeable void in the user experience.

Premium players like Roon and Audirvana offer advanced control features and integration with Tidal, but they come with their own drawbacks. They are expensive and often introduce complexities and limitations that may not align with the needs or preferences of all users.

To bridge this gap, I am creating a remote control application for Tidal. My goal is to provide an accessible and user-friendly solution that allows users to enjoy Tidal's superior audio quality while offering the convenience of remote control. This app aims to enable seamless control over Tidal playback from any device, enhancing the listening experience for Tidal users.

## Contributing
Contributions are welcome! Please feel free to submit a pull request.

## Acknowledgements
Based on [electron-inject](https://github.com/tintinweb/electron-inject).
