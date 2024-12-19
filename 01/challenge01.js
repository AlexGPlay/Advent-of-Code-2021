const fs = require("fs");

const lines = fs
  .readFileSync("input.txt")
  .toString()
  .split("\n")
  .map((line) => parseInt(line));

/**
 * Part 1 response
 */
let count = 0;
for (let i = 1; i < lines.length; i++) {
  if (lines[i] > lines[i - 1]) count++;
}

console.log(count); // 1393

/**
 * Part 2 response
 */

const groups = [];
let count2 = 0;

for (let i = 2; i < lines.length; i++) {
  groups.push(lines[i] + lines[i - 1] + lines[i - 2]);
}

for (let i = 1; i < groups.length; i++) {
  if (groups[i] > groups[i - 1]) count2++;
}

console.log(count2); // 1359
