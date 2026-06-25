// Local Audio Asset Registry 
const tracks = [
    {
        title: "Lost Sky - Fearless",
        artist: "TULE",
        cover: "https://picsum.photos",
        src: "https://soundhelix.com" // Royalty-free testing streams
    },
    {
        title: "Cartoon - On & On",
        artist: "Daniel Levi",
        cover: "https://picsum.photos",
        src: "https://soundhelix.com"
    },
    {
        title: "Elektronomia - Sky High",
        artist: "Elektronomia",
        cover: "https://picsum.photos",
        src: "https://soundhelix.com"
    }
];

let currentTrackIndex = 0;
let isPlaying = false;
const audioPlayer = new Audio();

// Target DOM nodes
const songList = document.getElementById('songList');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const volumeBar = document.getElementById('volumeBar');
const currentTimeLabel = document.getElementById('currentTime');
const durationLabel = document.getElementById('duration');

const trackImg = document.getElementById('trackImg');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');

// Step 1: Render Available Tracks to UI
function loadPlaylists() {
    songList.innerHTML = "";
    tracks.forEach((track, index) => {
        const item = document.createElement('div');
        item.classList.add('song-item');
        item.onclick = () => selectAndPlayTrack(index);
        
        item.innerHTML = `
            <img src="${track.cover}" alt="Cover">
            <div class="song-item-details">
                <div class="song-item-title">${track.title}</div>
                <div class="song-item-artist">${track.artist}</div>
            </div>
        `;
        songList.appendChild(item);
    });
}

// Step 2: Initialize Targeted Audio Media Track
function loadTrack(index) {
    currentTrackIndex = index;
    const currentTrack = tracks[currentTrackIndex];
    
    audioPlayer.src = currentTrack.src;
    trackImg.src = currentTrack.cover;
    trackTitle.innerText = currentTrack.title;
    trackArtist.innerText = currentTrack.artist;
    
    progressBar.value = 0;
}

// Step 3: Global Playback Controls
function togglePlay() {
    if (audioPlayer.src === "") {
        loadTrack(0);
    }
    
    if (isPlaying) {
        audioPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audioPlayer.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
}

function selectAndPlayTrack(index) {
    loadTrack(index);
    isPlaying = false;
    togglePlay();
}

function nextTrack() {
    let nextIndex = currentTrackIndex + 1;
    if (nextIndex >= tracks.length) nextIndex = 0; // Wrap back to index zero
    selectAndPlayTrack(nextIndex);
}

function prevTrack() {
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) prevIndex = tracks.length - 1; // Seek to final element
    selectAndPlayTrack(prevIndex);
}

// Step 4: Time Formatter (seconds to MM:SS string structure)
function formatTime(secs) {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Step 5: Native Audio Streaming Context Event Subscriptions
audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const progressPercentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progressPercentage;
        currentTimeLabel.innerText = formatTime(audioPlayer.currentTime);
        durationLabel.innerText = formatTime(audioPlayer.duration);
    }
});

audioPlayer.addEventListener('loadedmetadata', () => {
    durationLabel.innerText = formatTime(audioPlayer.duration);
});

// Auto-advance logic upon track completion
audioPlayer.addEventListener('ended', nextTrack);

// Handle manual scrub manipulation tracking bar updates
progressBar.addEventListener('input', () => {
    if (audioPlayer.duration) {
        audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
    }
});

// Sync volume inputs with media runtime instance
volumeBar.addEventListener('input', () => {
    audioPlayer.volume = volumeBar.value / 100;
});

// Click assignments
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

// On Window Initialization 
loadPlaylists();
loadTrack(0);
