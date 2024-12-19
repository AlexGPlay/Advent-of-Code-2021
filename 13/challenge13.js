const fs = require("fs");

const lines = fs
  .readFileSync("./advent of code/adventofcode.com/13/input.txt")
  .toString()
  .split("\n");

const points = [];
const folds = [];

let arePoints = true;
for (const line of lines) {
  if (!line.trim()) {
    arePoints = false;
    continue;
  }
  if (arePoints) points.push(line.trim().split(","));
  else {
    const [foldDirection, foldAmount] = line.trim().split("=");
    folds.push(foldDirection.includes("y") ? [parseInt(foldAmount), 0] : [0, parseInt(foldAmount)]);
  }
}

const maxX = Math.max(...points.map((point) => point[1]));
const maxY = Math.max(...points.map((point) => point[0]));

const grid = new Array(maxX + 1).fill(0).map(() => new Array(maxY + 1).fill(0));
points.forEach(([y, x]) => (grid[x][y] = 1));

function verticalInvert(grid, fromX) {
  const invertedGrid = [];

  for (let i = 0; i < grid.length; i++) {
    let fromPoint = fromX - 1;
    if (!invertedGrid[i]) invertedGrid[i] = [];

    for (let j = fromX + 1; j < grid[i].length; j++) {
      invertedGrid[i][fromPoint--] = grid[i][j];
    }
  }

  return invertedGrid;
}

function horizontalInvert(grid, fromY) {
  let fromPoint = fromY - 1;

  const invertedGrid = [];

  for (let i = fromY + 1; i < grid.length; i++) {
    invertedGrid[fromPoint--] = [...grid[i]];
  }

  return invertedGrid;
}

function fold(grid, foldPoint) {
  const [x, y] = foldPoint;

  const newMaxX = x === 0 ? grid.length : x;
  const newMaxY = y === 0 ? grid[0].length : y;

  const newGrid = new Array(newMaxX).fill(0).map(() => new Array(newMaxY).fill(0));
  const invertedGrid = x !== 0 ? horizontalInvert(grid, x) : verticalInvert(grid, y);

  for (let i = 0; i < newMaxX; i++) {
    for (let j = 0; j < newMaxY; j++) {
      const value = grid[i][j] || invertedGrid[i]?.[j] || 0;
      newGrid[i][j] = value;
    }
  }

  return newGrid;
}

/**
 *
 * Part 1
 */
function countDots(grid) {
  let countedDots = 0;
  for (let i = 0; i < grid.length; i++)
    for (let j = 0; j < grid[i].length; j++) countedDots += grid[i][j];
  return countedDots;
}

let part1Grid = fold(grid, folds[0]);
console.log(countDots(part1Grid)); // 790

/**
 * Part 2
 */
let finalGrid = grid;
for (let foldPoint of folds) finalGrid = fold(finalGrid, foldPoint);

for (let i = 0; i < finalGrid.length; i++)
  console.log(finalGrid[i].join("").replaceAll("1", "#").replaceAll("0", ".")); // PGHZBFJC
