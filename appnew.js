// --- 1. Selectors for HTML Elements ---
const audio = document.getElementById('main-audio');
const progressBar = document.querySelector('.progress-bar');
const currTime = document.querySelector('.current-time'); // Make sure this class is correctly set in HTML
const totTime = document.querySelector('.total-time');
const volumeSlider = document.querySelector('.volume-slider');
const playCardButtons = document.querySelectorAll('.play-card-btn');




// Selectors for Album Info to update dynamically
const albumImg = document.querySelector('.album-image');
const albumTitle = document.querySelector('.album-title');
const albumInfo = document.querySelector('.album-info');


// const audioPlayer = document.getElementById('main-audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');



// Eevent listner of previous button
prevBtn.addEventListener('click', () => {
   
});


// --- 2. Song Data Array ---
const songs = [
    { title: "Top 50 - Global", artist: "Your daily updates...", img: "assetsnew/card1img.jpeg", path: "songs/song1.mp3" },
    { title: "Mahiye Jinna Sohna", artist: "Darshan Raval", img: "assetsnew/card2img.jpeg", path: "songs/mahiyejinna.mp3" },
    { title: "Mere Pass Tum Ho", artist: "Silent Ocean", img: "assetsnew/card3img.jpeg", path: "songs/merepasstumho.mp3" },
    { title: "Naa Ready (From 'leo')", artist: "Vijay, Anirudh Ravichander", img: "assetsnew/card4img.jpeg", path: "songs/Naa Ready.mp3" },
    { title: "Phir Bhi Tumko Chaahunga", artist: "Arijit", img: "assetsnew/newimg1.jpg", path: "songs/phirbhitumkochahung.mp3" },
    { title: "Baarishon Mein", artist: "Darshan Raval", img: "assetsnew/newimg2.jpg", path: "songs/barishonmein.mp3" }
    
];

let songIndex = 0; 
let isPlaying = false;


// --- 4. Core Player Functions ---

// Function to Load Song details and source
function loadSong(song) {
    albumTitle.innerText = song.title;
    albumInfo.innerText = song.artist;
    albumImg.src = song.img;
    audio.src = song.path;
    
    // Reset progress bar on new song load
    progressBar.value = 0; 
    currTime.innerText = "00:00"; 
    
}

// Function to Play Song
function playSong() {
    isPlaying = true;
    audio.play();
    // Assuming you have a pause_icon.png image
    playPauseBtn.querySelector('img').src = "./assetsnew/play_icon.png"; 
    playPauseBtn.style.opacity = "1";
}

// Function to Pause Song
function pauseSong() {
    isPlaying = false;
    audio.pause();
    // Assuming player_icon3.png is the play icon
    playPauseBtn.querySelector('img').src = "./assetsnew/player_icon3.png"; 
}

// --- 5. Event Listeners ---

// A. Play/Pause Button Toggle (in the music player footer)
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

// B. Card Click Functionality (Play green button on card)
playCardButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Stop click from affecting parent card 
        e.stopPropagation(); 
        
        // Find the index associated with the clicked card
        const cardElement = button.closest('.card');
            const index = parseInt(cardElement.getAttribute('data-song-index')); 
            
            if (!isNaN(index)) {
                songIndex = index;
                loadSong(songs[songIndex]);
                playSong();
            
        }
    });
});


// C. Next/Previous Button Logic
function nextSong() {
    songIndex++;
    if (songIndex >= songs.length) {
        songIndex = 0; // Loop back to the first song
    }
    loadSong(songs[songIndex]);
    playSong();
}

function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1; // Loop back to the last song
    }
    loadSong(songs[songIndex]);
    playSong();
}

nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);


// D. Progress Bar (Time Updates)
audio.addEventListener('loadedmetadata', () => {
    // This runs once the audio file is loaded and we have duration info
    const duration = audio.duration;
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
    totTime.innerText = `${durationMinutes}:${durationSeconds}`;
});

audio.addEventListener('timeupdate', (e) => {
    const { duration, currentTime } = e.target;
    
    // Update Slider Value
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;
        
        // Update Current Time Text
        const currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;

        currTime.innerText = `${currentMinutes}:${currentSeconds}`;
    }
});

// E. Seek Functionality (Click on Progress Bar)

progressBar.addEventListener('input', () => {
    const duration = audio.duration;
    // Set audio playback position based on slider percentage
    audio.currentTime = (progressBar.value / 100) * duration;
    
});

// F. Volume Control
volumeSlider.addEventListener('input', (e) => {
    // Volume is a value between 0 and 1. We divide the 0-100 slider value by 100.
    audio.volume = e.target.value / 100;
});

// G. Auto-play next song when current song ends
audio.addEventListener('ended', nextSong);


// --- 6. Initial Load ---
loadSong(songs[songIndex]);