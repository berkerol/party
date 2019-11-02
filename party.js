/* global performance FPSMeter */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const getTime = typeof performance === 'function' ? performance.now : Date.now;
const FRAME_THRESHOLD = 300;
const FRAME_DURATION = 1000 / 58;
let then = getTime();
let acc = 0;
let animation;
const meter = new FPSMeter({
  left: canvas.width - 130 + 'px',
  top: 'auto',
  bottom: '12px',
  theme: 'colorful',
  heat: 1,
  graph: 1
});

const confetti = {
  highestAlpha: 1.0,
  highestLength: 20,
  highestLengthChange: 0.5,
  highestLineWidth: 10,
  highestLineWidthChange: 0.5,
  highestRotation: 0.02,
  highestSpeedX: 1,
  highestSpeedY: 4,
  lowestAlpha: 0.6,
  lowestLength: 10,
  lowestLengthChange: 0.1,
  lowestLineWidth: 5,
  lowestLineWidthChange: 0.1,
  lowestRotation: 0.01,
  lowestSpeedX: -1,
  lowestSpeedY: 2,
  probability: 0.5,
  sideProbability: 0.1
};

const confettis = [];

draw();
document.addEventListener('keyup', keyUpHandler);
window.addEventListener('resize', resizeHandler);

function draw () {
  const now = getTime();
  let ms = now - then;
  let frames = 0;
  then = now;
  if (ms < FRAME_THRESHOLD) {
    acc += ms;
    while (acc >= FRAME_DURATION) {
      frames++;
      acc -= FRAME_DURATION;
    }
  }
  meter.tick();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const c of confettis) {
    ctx.lineWidth = c.lineWidth;
    ctx.strokeStyle = c.color;
    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(c.x + Math.sin(c.angle) * c.length, c.y + Math.cos(c.angle) * c.length);
    ctx.stroke();
  }
  createConfettis();
  removeConfettis(frames);
  animation = window.requestAnimationFrame(draw);
}

function createConfettis () {
  if (Math.random() < confetti.probability) {
    const color = generateRandomRgbColor();
    const alpha = confetti.lowestAlpha + Math.random() * (confetti.highestAlpha - confetti.lowestAlpha);
    const length = confetti.lowestLength + Math.random() * (confetti.highestLength - confetti.lowestLength);
    const lengthChange = confetti.lowestLengthChange + Math.random() * (confetti.highestLengthChange - confetti.lowestLengthChange);
    const lineWidth = confetti.lowestLineWidth + Math.random() * (confetti.highestLineWidth - confetti.lowestLineWidth);
    const lineWidthChange = confetti.lowestLineWidthChange + Math.random() * (confetti.highestLineWidthChange - confetti.lowestLineWidthChange);
    const rotation = confetti.lowestRotation + Math.random() * (confetti.highestRotation - confetti.lowestRotation);
    let speedX = confetti.lowestSpeedX + Math.random() * (confetti.highestSpeedX - confetti.lowestSpeedX);
    let x;
    let y;
    if (Math.random() < confetti.sideProbability) {
      if (Math.random() < 0.5) {
        x = -length;
        speedX = Math.abs(speedX);
      } else {
        x = canvas.width + length;
        speedX = -Math.abs(speedX);
      }
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = -length;
    }
    confettis.push({
      x,
      y,
      angle: 0,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`,
      length,
      lengthOriginal: length,
      lengthChange: Math.random() < 0.5 ? lengthChange : -lengthChange,
      lineWidth,
      lineWidthOriginal: lineWidth,
      lineWidthChange: Math.random() < 0.5 ? lineWidthChange : -lineWidthChange,
      rotation: Math.random() < 0.5 ? rotation : -rotation,
      speedX,
      speedY: confetti.lowestSpeedY + Math.random() * (confetti.highestSpeedY - confetti.lowestSpeedY)
    });
  }
}

function removeConfettis (frames) {
  for (let i = confettis.length - 1; i >= 0; i--) {
    const c = confettis[i];
    if (c.x + c.length < 0 || c.x - c.length > canvas.width || c.y - c.length > canvas.height) {
      confettis.splice(i, 1);
    } else {
      c.x += c.speedX * frames;
      c.y += c.speedY * frames;
      c.angle += c.rotation * frames;
      if (c.length < Math.abs(c.lengthChange) || c.length > c.lengthOriginal) {
        c.lengthChange = -c.lengthChange;
      }
      c.length += c.lengthChange * frames;
      if (c.lineWidth < Math.abs(c.lineWidthChange) || c.lineWidth > c.lineWidthOriginal) {
        c.lineWidthChange = -c.lineWidthChange;
      }
      c.lineWidth += c.lineWidthChange * frames;
    }
  }
}

function generateRandomRgbColor () {
  return [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
}

function keyUpHandler (e) {
  if (e.keyCode === 80) {
    if (animation === undefined) {
      animation = window.requestAnimationFrame(draw);
    } else {
      window.cancelAnimationFrame(animation);
      animation = undefined;
    }
  }
}

function resizeHandler () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
