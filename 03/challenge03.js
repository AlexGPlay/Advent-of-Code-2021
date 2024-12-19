const fs = require("fs");

const lines = fs
  .readFileSync("input.txt")
  .toString()
  .split("\n")
  .map((entry) => entry.trim().split(""));

/**
 * Part 1
 */
let gammaRate = "";
let epsilonRate = "";

for (let i = 0; i < lines[0].length; i++) {
  let count = [0, 0];
  lines.forEach((line) => count[line[i]]++);

  const max = count[0] > count[1] ? 0 : 1;
  const min = count[0] < count[1] ? 0 : 1;

  gammaRate += max.toString();
  epsilonRate += min.toString();
}

console.log(parseInt(gammaRate, 2) * parseInt(epsilonRate, 2)); // 1540244

/**
 * Part 2
 */
let oxygenNumbers = [...lines];
let co2ScrubberNumbers = [...lines];
for (let i = 0; i < lines[0].length; i++) {
  let oxygenCount = [0, 0];
  let co2ScrubberCount = [0, 0];

  oxygenNumbers.forEach((line) => oxygenCount[line[i]]++);
  co2ScrubberNumbers.forEach((line) => co2ScrubberCount[line[i]]++);

  const maxOxygen =
    oxygenCount[0] === oxygenCount[1] ? "1" : oxygenCount[0] > oxygenCount[1] ? "0" : "1";
  const minCo2Scrubber =
    co2ScrubberCount[0] === co2ScrubberCount[1]
      ? "0"
      : co2ScrubberCount[0] < co2ScrubberCount[1]
      ? "0"
      : "1";

  if (oxygenNumbers.length > 1)
    oxygenNumbers = oxygenNumbers.filter((line) => line[i] === maxOxygen);

  if (co2ScrubberNumbers.length > 1)
    co2ScrubberNumbers = co2ScrubberNumbers.filter((line) => line[i] === minCo2Scrubber);

  if (oxygenNumbers.length === 1 && co2ScrubberNumbers.length === 1) break;
}

console.log(parseInt(oxygenNumbers[0].join(""), 2) * parseInt(co2ScrubberNumbers[0].join(""), 2)); // 4203981
