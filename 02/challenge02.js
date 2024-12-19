const fs = require("fs");

const lines = fs.readFileSync("input.txt").toString().split("\n");

/**
 * Part 1
 */
let horizontalPosition = 0;
let depth = 0;

lines.forEach((line) => {
  const [kind, steps] = line.split(" ");
  if (kind === "forward") {
    horizontalPosition += parseInt(steps);
  } else if (kind === "down") {
    depth += parseInt(steps);
  } else if (kind === "up") {
    depth -= parseInt(steps);
  }
});

console.log(horizontalPosition * depth); // 2039912

/**
 * Part 2
 */
let horizontalPosition2 = 0;
let depth2 = 0;
let aim = 0;

lines.forEach((line) => {
  const [kind, steps] = line.split(" ");
  if (kind === "forward") {
    horizontalPosition2 += parseInt(steps);
    depth2 += aim * parseInt(steps);
  } else if (kind === "down") {
    aim += parseInt(steps);
  } else if (kind === "up") {
    aim -= parseInt(steps);
  }
});

console.log(horizontalPosition2 * depth2); // 1942068080
