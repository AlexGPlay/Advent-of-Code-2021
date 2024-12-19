const fs = require("fs");

const lines = fs
  .readFileSync("./advent of code/adventofcode.com/14/input.txt")
  .toString()
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const [initialString, ...rest] = lines;

const changes = rest.reduce((acc, changes) => {
  const [from, to] = changes.split(" -> ");
  return { ...acc, [from]: to };
}, {});

const letterCount = {};
for (let i = 0; i < initialString.length; i++) {
  letterCount[initialString.charAt(i)]
    ? letterCount[initialString.charAt(i)]++
    : (letterCount[initialString.charAt(i)] = 1);
}

let packs = {};

for (let i = 0; i < initialString.length - 1; i++) {
  const pack = initialString.slice(i, i + 2);
  packs[pack] = packs[pack] ? packs[pack] + 1 : 1;
}

function step(packs, changes, letterCount) {
  const newPacks = {};
  for (let pack in packs) {
    const generatedChange = changes[pack] ? changes[pack] : pack;

    const newPack = [
      [pack[0], generatedChange],
      [generatedChange, pack[1]],
    ];

    const packCount = packs[pack];

    letterCount[generatedChange]
      ? (letterCount[generatedChange] += packCount)
      : (letterCount[generatedChange] = packCount);

    newPack.forEach((pack) => {
      const packName = pack.join("");
      const length = newPacks[packName] ? newPacks[packName] + packCount : packCount;

      newPacks[packName] = length;
    });
  }

  return newPacks;
}

const steps = 40; // 10 for part 1
for (let i = 0; i < steps; i++) {
  packs = step(packs, changes, letterCount);
}

const mostCommonLetter = Object.keys(letterCount).reduce((a, b) =>
  letterCount[a] > letterCount[b] ? a : b
);

const leastCommonLetter = Object.keys(letterCount).reduce((a, b) =>
  letterCount[a] < letterCount[b] ? a : b
);

// Part 1 => 3095
// Part 2 => 3152788426516
console.log(letterCount[mostCommonLetter] - letterCount[leastCommonLetter]);
