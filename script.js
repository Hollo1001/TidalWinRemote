var footerPlayer = document.getElementById('footerPlayer');
var PlayButton = document.evaluate(".//button[@aria-label='Pause']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue || document.evaluate(".//button[@aria-label='Play']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var NextButton = document.evaluate(".//button[@aria-label='Next']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var PreviousButton = document.evaluate(".//button[@aria-label='Previous']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var ShuffleButton = document.evaluate(".//button[@aria-label='Shuffle']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var RepeatButton = document.evaluate(".//button[@aria-label='Repeat']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue || document.evaluate(".//button[@aria-label='Repeat one']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var LikeButton = document.evaluate(".//button[@aria-label='Add to My Collection']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue || document.evaluate(".//button[@aria-label='Remove from My Collection']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var BlockButton = document.evaluate(".//button[@aria-label='Block']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var PlayQueueButton = document.evaluate(".//button[@aria-label='Play queue']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var PlayQueue = document.evaluate(".//div[@data-test='playqueue-scroll']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

var CurrentTrackOptions = document.evaluate(".//button[@aria-label='Show options']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var AddToPlaylist = document.evaluate(".//button[@data-test='add-to-playlist']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var AddToCollection = document.evaluate(".//button[@data-test='add-to-remove-from-collection']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

var TrackDuration = document.evaluate(".//time[@data-test='duration']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var CurrentTime = document.evaluate(".//time[@data-test='current-time']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

var CurrentTrackImage = document.evaluate(".//figure[@data-test='current-media-imagery']//img", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var CurrentTrackName = document.evaluate(".//div[@data-test='footer-track-title']//span", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var CurrentArtistName = document.evaluate(".//span[@class='artist-link']", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var PlayingFrom = document.evaluate("//div[1]/div[2]/div[3]/span[2]/a", footerPlayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

function updateCurrentSong() {
    var currentTrack = {
        image: CurrentTrackImage.src,
        title: CurrentTrackName.textContent,
        artist: CurrentArtistName.textContent,
        currentTime: CurrentTime.textContent,
        duration: TrackDuration.textContent,
        PlayingFrom: PlayingFrom.textContent,
        play: PlayButton.ariaLabel == "pause" ? "true" : "false",
    };

    fetch('http://localhost:5000/api/song', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentTrack)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Call updateCurrentSong every 1 second
setInterval(updateCurrentSong, 1000);

function pause() {
    PlayButton.click();
}

function previous() {
    PreviousButton.click();
}

function next() {
    NextButton.click();
}

function toggleMute() {

}