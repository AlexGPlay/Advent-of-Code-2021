const fs = require("fs");

let line = fs.readFileSync("./advent of code/adventofcode.com/17/input.txt").toString().trim();

const [x1, x2, y1, y2] = ((line) => {
  const [usefulX, usefulY] = line.replace("target area: ", "").replace(",", "").split(" ");

  const [x1, x2] = usefulX
    .replace("x=", "")
    .split("..")
    .map((x) => parseInt(x));
  const [y1, y2] = usefulY
    .replace("y=", "")
    .split("..")
    .map((y) => parseInt(y));

  return [x1, x2, y1, y2];
})(line);

function calculateValidX(x1, x2) {
  const validX = [];

  for (let i = 1; i < x2 * 2; i++) {
    let currentX = 0;
    let currentXSpeed = i;
    let iterations = 0;

    while (true) {
      currentX += currentXSpeed;
      currentXSpeed -= 1;
      iterations++;

      if (currentX >= x1 && currentX <= x2) {
        validX.push({ value: i, iterations });
        break;
      }
      if (currentX > x2) break;
      if (currentXSpeed === 0) break;
    }
  }

  return validX;
}

function calculateValidY(y1, y2) {
  const validY = [];
  const maxIterations = Math.abs(y2) * 2;

  for (let i = y1; i < maxIterations; i++) {
    let currentY = 0;
    let currentYSpeed = i;
    let iterations = 0;

    while (true) {
      currentY += currentYSpeed;
      currentYSpeed -= 1;
      iterations++;

      if (currentY >= y1 && currentY <= y2) {
        validY.push({ value: i, iterations });
        break;
      }
      if (currentY < y1) break;
    }
  }

  return validY;
}

function computeInputs(validX, validY) {
  const validInputs = [];

  for (let { value: xValue, iterations: xIterations } of validX) {
    validY.forEach((validY) => validInputs.push({ xValue, yValue: validY.value }));
  }

  return validInputs;
}

function simulateMaxHeight(validInputs) {
  let maxHeight = 0;

  for (let { yValue } of validInputs) {
    let currentY = 0;
    let currentYSpeed = yValue;

    while (currentY >= 0) {
      currentY += currentYSpeed;
      currentYSpeed -= 1;

      if (currentY > maxHeight) maxHeight = currentY;
    }
  }

  return maxHeight;
}

function simulate(validEntries) {
  let realValidEntries = [];

  for (let { xValue, yValue } of validEntries) {
    let currentX = 0;
    let currentXSpeed = xValue;
    let currentY = 0;
    let currentYSpeed = yValue;

    while (true) {
      currentX += currentXSpeed;
      currentY += currentYSpeed;

      currentXSpeed -= currentXSpeed === 0 ? 0 : currentXSpeed > 0 ? 1 : -1;
      currentYSpeed -= 1;

      if (currentY >= y1 && currentY <= y2 && currentX >= x1 && currentX <= x2) {
        if (!realValidEntries.some((entry) => entry.xValue === xValue && entry.yValue === yValue))
          realValidEntries.push({ xValue, yValue });
        break;
      }
      if (currentY < y1) break;
      if (currentX > x2) break;
    }
  }

  return realValidEntries;
}

const validX = calculateValidX(x1, x2);
const validY = calculateValidY(y1, y2);

const validEntries = computeInputs(validX, validY);
const simulatedEntries = simulate(validEntries);

const maxHeight = simulateMaxHeight(simulatedEntries);

console.log(maxHeight); // 5778
console.log(simulatedEntries.length); // 2576
