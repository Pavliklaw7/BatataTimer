import {backgrounds, svgSoundOff, svgSoundOn} from './consts.js'

let duration = 25 * 60; // 25 minutes
let remaining = duration;
let timerInterval = null;
let isPaused = false;
let currentBackground = 0;
let sessionsToday = 0;


const timeDisplay = document.getElementById("time-display");
const progress = document.getElementById("progress");
const pauseBtn = document.getElementById("pause-btn");
const soundToggle = document.getElementById("sound-toggle");
const soundIcon = document.getElementById("sound-icon");
const audio = document.getElementById("background-audio");
const bgName = document.getElementById("bg-name");
const sessionsEl = document.getElementById("sessions-today");

function updateTimeDisplay() {
  const mins = Math.floor(remaining / 60).toString().padStart(2, "0");
  const secs = (remaining % 60).toString().padStart(2, "0");
  timeDisplay.textContent = `${mins}:${secs}`;
  const percent = remaining / duration;
  progress.style.strokeDashoffset = 565.48 * (1 - percent);
}

function applyBackground(bg) {
  document.querySelector('.background-blur-layer').style.backgroundImage = `url('${bg.image}')`;
  bgName.textContent = bg.name;
  audio.src = bg.audio;
  if (!audio.muted) audio.play();
}

function switchBackground(dir) {
  currentBackground = (currentBackground + dir + backgrounds.length) % backgrounds.length;
  const bg = backgrounds[currentBackground];
  applyBackground(bg);
}

function renderSoundIcon() {
  const iconContainer = document.getElementById('sound-toggle');
  iconContainer.innerHTML = audio.muted ? svgSoundOff : svgSoundOn;
}

document.getElementById("prev-bg").addEventListener("click", () => switchBackground(-1));
document.getElementById("next-bg").addEventListener("click", () => switchBackground(1));

pauseBtn.addEventListener("click", () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? "START" : "PAUSE";
});

soundToggle.addEventListener("click", () => {
  audio.muted = !audio.muted;
  renderSoundIcon()
});

function tick() {
  if (!isPaused && remaining > 0) {
    remaining--;
    updateTimeDisplay();
    if (remaining === 0) {
      sessionsToday++;
      sessionsEl.textContent = `Today: ${sessionsToday}`;
      clearInterval(timerInterval);
    }
  }
}

function startTimer() {
  updateTimeDisplay();
  if (!timerInterval) {
    timerInterval = setInterval(tick, 1000);
  }
  applyBackground(backgrounds[currentBackground]);
}

// startTimer();

function init() {
  applyBackground(backgrounds[currentBackground]);
  renderSoundIcon()
}

init()
