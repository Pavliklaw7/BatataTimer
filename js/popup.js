import { backgrounds, svgSoundOff, svgSoundOn, defaultDuration, startTimerText } from './consts.js';

let duration = defaultDuration * 60;
let remaining = duration;
let timerInterval = null;
let isPaused = true;
let currentBackground = 0;
let sessionsToday = 0;
let totalTrackedSeconds = 0;
let inSettings = false;

const timeDisplay = document.getElementById("time-display");
const progress = document.getElementById("progress");
const controlBtn = document.getElementById("control-btn");
const resetBtn = document.getElementById("reset-btn");
const soundToggle = document.getElementById("sound-toggle");
const audio = document.getElementById("background-audio");
const bgName = document.getElementById("bg-name");
const sessionsEl = document.getElementById("sessions-today");
const settingsBtn = document.getElementById("settings-btn");
const controlsContainer = document.querySelector('#timer-circle-controls');

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
  if (!audio.muted && !isPaused) audio.play();
}

function switchBackground(dir) {
  currentBackground = (currentBackground + dir + backgrounds.length) % backgrounds.length;
  const bg = backgrounds[currentBackground];
  applyBackground(bg);
}

function renderSoundIcon() {
  soundToggle.innerHTML = audio.muted ? svgSoundOff : svgSoundOn;
}

function updateSessionsDisplay() {
  if (totalTrackedSeconds < 1) sessionsEl.textContent = `Today: 0 min`;

  const minutes = Math.floor(totalTrackedSeconds / 60);
  sessionsEl.textContent = `Today: ${minutes} min`;
}

function tick() {
  if (!isPaused && remaining > 0) {
    remaining--;
    totalTrackedSeconds++;
    updateTimeDisplay();
    updateBadgeTime();
    updateSessionsDisplay();

    if (remaining === 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      playGong();
      pauseTimer();
      controlBtn.textContent = startTimerText;
      isPaused = true;

    }
  }

  // if (remaining <= 0) {
  //   resetBtn.classList.add('active');
  // }
  // resetTimer
}

function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(tick, 1000);
  }

  if (inSettings) {
    inSettings = false;
    controlsContainer.classList.remove('visible');
  }

  isPaused = false;

  controlBtn.textContent = "PAUSE";
  if (!audio.muted) {
    audio.play().catch((e) => {
      console.warn('Audio autoplay blocked:', e.message);
    });
  }
}

function pauseTimer() {
  isPaused = true;

  controlBtn.textContent = startTimerText;
  if (audio) audio.pause();
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  remaining = duration;
  updateTimeDisplay();
  inSettings = false;
  controlsContainer.classList.remove('visible');
  controlBtn.textContent = startTimerText;
  isPaused = true;
  chrome.runtime.sendMessage({ type: 'UPDATE_BADGE', text: '' });
  if (audio) audio.pause();
}

function toggleSettings() {
  inSettings = !inSettings;
  pauseTimer();
  renderSettingsControls(inSettings);
}

function renderSettingsControls(show) {
  if (show) {
    controlsContainer.classList.add('visible');

    document.getElementById("decrease-time").addEventListener("click", () => {
      duration = Math.max(5 * 60, duration - 5 * 60);
      remaining = duration;
      updateTimeDisplay();
    });

    document.getElementById("increase-time").addEventListener("click", () => {
      duration += 5 * 60;
      remaining = duration;
      updateTimeDisplay();
    });
  } else {
    controlsContainer.classList.remove('visible');
  }
}

function playGong() {
  const gong = new Audio('../assets/audio/gong.mp3');
  gong.play();
}

function updateBadgeTime() {
  const mins = Math.floor(remaining / 60).toString().padStart(2, "0");
  const secs = (remaining % 60).toString().padStart(2, "0");
  chrome.runtime.sendMessage({
    type: 'UPDATE_BADGE',
    text: `${mins}:${secs}`
  });
}

soundToggle.addEventListener("click", () => {
  audio.muted = !audio.muted;
  renderSoundIcon();
});

document.getElementById("prev-bg").addEventListener("click", () => switchBackground(-1));
document.getElementById("next-bg").addEventListener("click", () => switchBackground(1));
settingsBtn.addEventListener("click", toggleSettings);
resetBtn.addEventListener("click", resetTimer);
document.getElementById("control-btn").addEventListener("click", () => {
  if (isPaused) {
    startTimer();
  } else {
    pauseTimer();
  }
});

function init() {
  applyBackground(backgrounds[currentBackground]);
  renderSoundIcon();
  updateTimeDisplay();
  updateSessionsDisplay();
  controlBtn.textContent = startTimerText;
}

init();