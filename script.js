const greetings = [
  "嗨！很高興見到你 😊",
  "祝你有美好的一天 ☀️",
  "歡迎再次光臨！",
  "願你今天心情like海洋一樣平靜 🌊",
  "謝謝你的到來！"
];

function sayHello() {
  const el = document.getElementById('greeting');
  const msg = greetings[Math.floor(Math.random() * greetings.length)];
  el.textContent = msg;
}

function updateClock() {
  const now = new Date();
  const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  document.getElementById('clock').textContent =
    now.toLocaleDateString('zh-TW') + '　' + now.toLocaleTimeString('zh-TW', options);
}

updateClock();
setInterval(updateClock, 1000);

/* ---------- 網路攝影機拍照功能 ---------- */

const video = document.getElementById('video');
const photoCanvas = document.getElementById('photoCanvas');
const countdownOverlay = document.getElementById('countdownOverlay');
const startCameraBtn = document.getElementById('startCameraBtn');
const captureBtn = document.getElementById('captureBtn');
const saveBtn = document.getElementById('saveBtn');
const cameraStatus = document.getElementById('cameraStatus');

let mediaStream = null;

async function startCamera() {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = mediaStream;
    video.classList.remove('hidden');
    photoCanvas.classList.add('hidden');
    captureBtn.disabled = false;
    saveBtn.disabled = true;
    startCameraBtn.disabled = true;
    cameraStatus.textContent = '攝影機已啟動，準備拍照！';
  } catch (err) {
    cameraStatus.textContent = '無法開啟攝影機：' + err.message;
  }
}

function countdownThenCapture() {
  captureBtn.disabled = true;
  let count = 3;
  countdownOverlay.textContent = count;
  countdownOverlay.classList.add('show');

  const timer = setInterval(() => {
    count -= 1;
    if (count > 0) {
      countdownOverlay.classList.remove('show');
      void countdownOverlay.offsetWidth;
      countdownOverlay.textContent = count;
      countdownOverlay.classList.add('show');
    } else {
      clearInterval(timer);
      countdownOverlay.classList.remove('show');
      takePhoto();
    }
  }, 1000);
}

function takePhoto() {
  const ctx = photoCanvas.getContext('2d');
  photoCanvas.width = video.videoWidth;
  photoCanvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, photoCanvas.width, photoCanvas.height);

  video.classList.add('hidden');
  photoCanvas.classList.remove('hidden');

  saveBtn.disabled = false;
  captureBtn.disabled = false;
  cameraStatus.textContent = '拍好了！可以另存照片，或再拍一次。';
}

function savePhoto() {
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  link.download = `照片_${timestamp}.png`;
  link.href = photoCanvas.toDataURL('image/png');
  link.click();
  cameraStatus.textContent = '照片已下載！';
}

startCameraBtn.addEventListener('click', startCamera);
captureBtn.addEventListener('click', countdownThenCapture);
saveBtn.addEventListener('click', savePhoto);
