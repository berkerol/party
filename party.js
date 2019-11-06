/* global canvas ctx addPause addResize loop paintLine generateRandomNumber generateRandomRgbColor */
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

addPause();
addResize();

loop(function (frames) {
  for (const c of confettis) {
    ctx.lineWidth = c.lineWidth;
    paintLine(c.x, c.y, c.x + Math.sin(c.angle) * c.length, c.y + Math.cos(c.angle) * c.length, c.color);
  }
  createConfettis();
  removeConfettis(frames);
});

function createConfettis () {
  if (Math.random() < confetti.probability) {
    const color = generateRandomRgbColor();
    const alpha = generateRandomNumber(confetti.lowestAlpha, confetti.highestAlpha);
    const length = generateRandomNumber(confetti.lowestLength, confetti.highestLength);
    const lengthChange = generateRandomNumber(confetti.lowestLengthChange, confetti.highestLengthChange);
    const lineWidth = generateRandomNumber(confetti.lowestLineWidth, confetti.highestLineWidth);
    const lineWidthChange = generateRandomNumber(confetti.lowestLineWidthChange, confetti.highestLineWidthChange);
    const rotation = generateRandomNumber(confetti.lowestRotation, confetti.highestRotation);
    let speedX = generateRandomNumber(confetti.lowestSpeedX, confetti.highestSpeedX);
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
      speedY: generateRandomNumber(confetti.lowestSpeedY, confetti.highestSpeedY)
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
