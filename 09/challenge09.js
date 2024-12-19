const fs = require("fs");

const lines = fs
  .readFileSync("./advent of code/adventofcode.com/09/input.txt")
  .toString()
  .split("\n")
  .map((line) =>
    line
      .trim()
      .split("")
      .map((elem) => parseInt(elem))
  );

/**
 * Part 1
 */
const lowPoints = [];

for (let i = 0; i < lines.length; i++) {
  for (let j = 0; j < lines[i].length; j++) {
    const current = lines[i][j];
    const adjacents = [
      lines[i]?.[j - 1],
      lines[i]?.[j + 1],
      lines[i - 1]?.[j],
      lines[i + 1]?.[j],
    ].filter((elem) => elem !== undefined);

    const isTheLowest = adjacents.every((elem) => elem > current);
    if (isTheLowest) lowPoints.push({ i, j });
  }
}

const addedRiskLevel = lowPoints.reduce((acc, { i, j }) => acc + lines[i][j] + 1, 0);
console.log(addedRiskLevel); // 506

/**
 * Part 2
 */

const recurseForBasin = (lines, i, j, lastValue, currentBasin, allBasins) => {
  if (lines[i]?.[j] === undefined) return;
  if (currentBasin.some((elem) => elem.i === i && elem.j === j)) return;
  if (allBasins.some((basin) => basin.some((elem) => elem.i === i && elem.j === j))) return;
  if (lines[i][j] <= lastValue) return;
  if (lines[i][j] === 9) return;

  currentBasin.push({ i, j, height: lines[i][j] });

  const adjacents = [
    [i, j - 1],
    [i, j + 1],
    [i - 1, j],
    [i + 1, j],
  ];

  adjacents.forEach((elem) => {
    recurseForBasin(lines, elem[0], elem[1], lines[i][j], currentBasin, allBasins);
  });
};

const basins = [];
for (let { i, j } of lowPoints) {
  const current = lines[i][j];
  const adjacentPositions = [
    [i, j - 1],
    [i, j + 1],
    [i - 1, j],
    [i + 1, j],
  ];

  const currentBasin = [{ i, j, height: current }];

  adjacentPositions.forEach((elem) => {
    recurseForBasin(lines, elem[0], elem[1], current, currentBasin, basins);
  });

  basins.push(currentBasin);
}

const basinsSize = basins.map((elem) => elem.length).sort((a, b) => b - a);
const threeBiggest = basinsSize.slice(0, 3);

console.log(threeBiggest[0] * threeBiggest[1] * threeBiggest[2]); // 931200
