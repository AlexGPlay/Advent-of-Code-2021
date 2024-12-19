const fs = require("fs");

const lines = fs
  .readFileSync("./advent of code/adventofcode.com/11/input.txt")
  .toString()
  .split("\n")
  .map((entry) =>
    entry
      .trim()
      .split("")
      .map((elem) => parseInt(elem))
  );

/**
 * Part 1
 */
const steps = 100;
let flashCount = 0;

for (let i = 0; i < steps; i++) {
  const toIncrease = [];
  const toClean = [];
  lines.map((line, lineIdx) => line.map((_, elemIdx) => toIncrease.push([lineIdx, elemIdx])));

  while (toIncrease.length > 0) {
    const [i, j] = toIncrease.pop();
    lines[i][j]++;

    if (lines[i][j] === 10) {
      toClean.push([i, j]);

      const adjacents = [
        [i - 1, j],
        [i + 1, j],
        [i, j - 1],
        [i, j + 1],
        [i - 1, j - 1],
        [i - 1, j + 1],
        [i + 1, j - 1],
        [i + 1, j + 1],
      ];

      adjacents.forEach(([i, j]) => {
        if (lines[i]?.[j] !== undefined) {
          toIncrease.push([i, j]);
        }
      });
    }
  }

  flashCount += toClean.length;
  toClean.forEach(([i, j]) => (lines[i][j] = 0));
}

console.log(flashCount); // 1634

/**
 * Part 2
 */
let step = 100;

while (true) {
  step++;

  const toIncrease = [];
  const toClean = [];
  lines.map((line, lineIdx) => line.map((_, elemIdx) => toIncrease.push([lineIdx, elemIdx])));

  while (toIncrease.length > 0) {
    const [i, j] = toIncrease.pop();
    lines[i][j]++;

    if (lines[i][j] === 10) {
      toClean.push([i, j]);

      const adjacents = [
        [i - 1, j],
        [i + 1, j],
        [i, j - 1],
        [i, j + 1],
        [i - 1, j - 1],
        [i - 1, j + 1],
        [i + 1, j - 1],
        [i + 1, j + 1],
      ];

      adjacents.forEach(([i, j]) => {
        if (lines[i]?.[j] !== undefined) {
          toIncrease.push([i, j]);
        }
      });
    }
  }

  if (toClean.length === lines.length * lines[0].length) {
    break;
  }

  toClean.forEach(([i, j]) => (lines[i][j] = 0));
}

console.log(step); // 210
