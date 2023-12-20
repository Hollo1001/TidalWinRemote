document.addEventListener('DOMContentLoaded', (event) => {
    fetchSongInfo();
    setInterval(fetchSongInfo, 1000); // Update every second
});

function fetchSongInfo() {
    fetch('/api/song')
        .then(response => response.json())
        .then(data => updateSongInfo(data))
        .catch(error => console.error('Error fetching song info:', error));
}

function updateSongInfo(data) {
    document.getElementById('album-art').src = data.image;
    document.getElementById('track-title').textContent = data.title;
    document.getElementById('artist-name').textContent = data.artist;
    document.getElementById('current-time').textContent = `${data.currentTime}`;
    document.getElementById('duration').textContent = `${data.duration}`;
    document.getElementById('playing-from').textContent = `Playing From: ${data.PlayingFrom}`;
    document.getElementById('play').textContent = `${data.play ? "■" : "►"}`;
    // Existing code to update song information
    // Update progress bar width based on currentTime and duration
    const progressBar = document.getElementById('progress');
    const currentTimeInSeconds = data.currentTime.split(':')[0] * 60 + Number(data.currentTime.split(':')[1]);
    const durationInSeconds = data.duration.split(':')[0] * 60 + Number(data.duration.split(':')[1]);
    progressBar.value = currentTimeInSeconds;
    progressBar.setAttribute("max", `${durationInSeconds}`);
}

async function sendCommand(command) {
    const rawResponse = await fetch('/send_command', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command: command })
    });
    const content = await rawResponse.json();

    console.log(content);
}

function setupEventListeners() {
    document.getElementById('play').addEventListener('click', pause);
    document.getElementById('prev').addEventListener('click', playPrevious);
    document.getElementById('next').addEventListener('click', playNext);
    document.getElementById('volume').addEventListener('click', toggleMute);
    document.getElementById('more-options').addEventListener('click', showMoreOptions);
    document.getElementById('progress').addEventListener('change', seek);
}

function pause() {
    sendCommand("pause()");
}

function playPrevious() {
    sendCommand('previous()');
}

function playNext() {
    sendCommand('next()');
}

function toggleMute() {
    sendCommand('mute()');
}

function showMoreOptions() {
    // Code to show more options
}

function seek() {
    // Code to seek
}

document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
});
