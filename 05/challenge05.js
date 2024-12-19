const fs = require("fs");

const lines = fs
  .readFileSync("input.txt")
  .toString()
  .split("\n")
  .map((line) => {
    const [x1, y1, x2, y2] = line
      .trim()
      .split(/ -> |,/)
      .map((x) => parseInt(x));

    return { x1, y1, x2, y2 };
  });

let points = {};
let overlapCount = 0;

const checkOverlap = (currentX, currentY) => {
  const key = `${currentX},${currentY}`;
  if (!points[key]) points[key] = 0;
  points[key]++;

  if (points[key] === 2) overlapCount++;
};

/**
 * Part 1
 */
lines.forEach(({ x1, y1, x2, y2 }) => {
  let xDirection = x1 === x2 ? 0 : x1 < x2 ? 1 : -1;
  let yDirection = y1 === y2 ? 0 : y1 < y2 ? 1 : -1;

  if (xDirection !== 0 && yDirection !== 0) return;

  let currentX = x1;
  let currentY = y1;

  while (currentX !== x2 || currentY !== y2) {
    checkOverlap(currentX, currentY);
    currentX += xDirection;
    currentY += yDirection;
  }

  checkOverlap(currentX, currentY);
});

console.log(overlapCount); // 6548

/**
 * Part 2
 */
points = {};
overlapCount = 0;

lines.forEach(({ x1, y1, x2, y2 }) => {
  let xDirection = x1 === x2 ? 0 : x1 < x2 ? 1 : -1;
  let yDirection = y1 === y2 ? 0 : y1 < y2 ? 1 : -1;

  let currentX = x1;
  let currentY = y1;

  while (currentX !== x2 || currentY !== y2) {
    checkOverlap(currentX, currentY);
    currentX += xDirection;
    currentY += yDirection;
  }

  checkOverlap(currentX, currentY);
});

console.log(overlapCount); // 19663
