const fs = require("fs");

const lines = fs
  .readFileSync("./advent of code/adventofcode.com/07/input.txt")
  .toString()
  .split(",")
  .map((entry) => parseInt(entry));

const max = Math.max(...lines);
const min = Math.min(...lines);

const positions = lines.reduce((acc, curr) => {
  if (!acc[curr]) acc[curr] = 0;
  acc[curr] += 1;
  return acc;
}, {});

/**
 * Part 1
 */
let minCost = Number.POSITIVE_INFINITY;
let bestPosition = 0;

for (let i = min; i <= max; i++) {
  currentCost = Object.entries(positions).reduce((acc, [key, value]) => {
    const toPosition = Math.abs(parseInt(key) - i);
    return acc + toPosition * value;
  }, 0);

  if (currentCost < minCost) {
    bestPosition = i;
    minCost = currentCost;
  }
}

console.log(minCost); // 359648

/**
 * Part 2
 */
minCost = Number.POSITIVE_INFINITY;
bestPosition = 0;

for (let i = min; i <= max; i++) {
  currentCost = Object.entries(positions).reduce((acc, [key, value]) => {
    const toPosition = Math.abs(parseInt(key) - i);
    const appliedCost = (toPosition * (toPosition + 1)) / 2; // infinite series formula => (n * (n + 1)) / 2

    return acc + appliedCost * value;
  }, 0);

  if (currentCost < minCost) {
    bestPosition = i;
    minCost = currentCost;
  }
}

console.log(minCost); // 100727924
