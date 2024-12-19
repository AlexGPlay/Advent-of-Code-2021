const fs = require("fs");

const lines = fs
  .readFileSync("input.txt")
  .toString()
  .split(",")
  .map((entry) => parseInt(entry));

const days = 256; // 80 for part 1
const newLanternfishValue = 8;
const oldLanternfishValue = 6;

let buckets = new Array(9).fill(0);
lines.forEach((line) => buckets[line]++);

for (let i = 0; i < days; i++) {
  const newBuckets = new Array(9).fill(0);

  for (let j = newBuckets.length; j >= 0; j--) {
    let newValue = j - 1;
    if (newValue < 0) {
      newBuckets[newLanternfishValue] = buckets[j];
      newValue = oldLanternfishValue;
    }
    newBuckets[newValue] += buckets[j];
  }

  buckets = newBuckets;
}

// 380243 for part 1
// 1708791884591 for part 2
console.log(buckets.reduce((a, b) => a + b));
