const fs = require("fs");

const lines = fs
  .readFileSync("./advent of code/adventofcode.com/10/input.txt")
  .toString()
  .split("\n")
  .map((entry) => entry.trim().split(""));

// Valid symbols
const symbols = {
  "{": "}",
  "[": "]",
  "(": ")",
  "<": ">",
};

/**
 * Part 1
 */
const symbolScore = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const invalidSymbols = [];

for (let line of lines) {
  const stack = [];

  for (let symbol of line) {
    if (Object.keys(symbols).includes(symbol)) {
      stack.push(symbol);
    } else {
      const toCloseSymbol = stack.pop();
      if (symbol !== symbols[toCloseSymbol]) {
        invalidSymbols.push(symbol);
        break;
      }
    }
  }
}

console.log(invalidSymbols.reduce((acc, curr) => acc + symbolScore[curr], 0)); // 367227

/**
 * Part 2
 */
const symbolScore2 = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

const incompleteLines = [];

for (let line of lines) {
  const stack = [];
  let valid = true;

  for (let symbol of line) {
    if (Object.keys(symbols).includes(symbol)) {
      stack.push(symbol);
    } else {
      const toCloseSymbol = stack.pop();
      if (symbol !== symbols[toCloseSymbol]) {
        valid = false;
        break;
      }
    }
  }

  if (valid) {
    let score = 0;

    while (stack.length > 0) {
      const symbol = stack.pop();
      const closingChar = symbols[symbol];

      score *= 5;
      score += symbolScore2[closingChar];
    }

    incompleteLines.push(score);
  }
}

console.log(
  incompleteLines.sort((a, b) => a - b).splice(Math.floor(incompleteLines.length / 2), 1)[0]
); // 3583341858
