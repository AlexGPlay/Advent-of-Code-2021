const fs = require("fs");

let lines = fs
  .readFileSync("./advent of code/adventofcode.com/19/input.txt")
  .toString()
  .split("\n");

function buildScanners(lines) {
  const scanners = [];

  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    if (lines[i].includes("scanner")) {
      scanners.push([]);
      continue;
    }

    scanners[scanners.length - 1].push(lines[i].trim().split(",").map(Number));
  }

  return scanners;
}

function computeVectorsForPoints(scanner) {
  const vectors = [];

  for (let i = 0; i < scanner.length; i++) {
    for (let j = 0; j < scanner.length; j++) {
      if (vectors[i]?.[j]) continue;

      const [x1, y1, z1] = scanner[i];
      const [x2, y2, z2] = scanner[j];

      const vector = [x2 - x1, y2 - y1, z2 - z1];

      if (!vectors[i]) vectors[i] = [];
      vectors[i][j] = vector;

      if (!vectors[j]) vectors[j] = [];
      vectors[j][i] = vector;
    }
  }

  return vectors;
}

const MAX_ROTATIONS = 24;

function rotateScanner(scanner, rotation) {
  return scanner.map(([x, y, z]) => {
    const currentRotation = [
      [x, y, z],
      [-y, x, z],
      [-x, -y, z],
      [y, -x, z],
      [-z, y, x],
      [-y, -z, x],
      [z, -y, x],
      [y, z, x],
      [-x, y, -z],
      [-y, -x, -z],
      [x, -y, -z],
      [y, x, -z],
      [z, y, -x],
      [-y, z, -x],
      [-z, -y, -x],
      [y, -z, -x],
      [x, -z, y],
      [z, x, y],
      [-x, z, y],
      [-z, -x, y],
      [x, z, -y],
      [-z, x, -y],
      [-x, -z, -y],
      [z, -x, -y],
    ][rotation];

    return currentRotation;
  });
}

function matchVectorArrays(vectorArray1, vectorArray2) {
  for (let i = 0; i < vectorArray1.length; i++) {
    const vector1String = vectorArray1[i].map((elem) => elem.join(","));

    for (let j = 0; j < vectorArray2.length; j++) {
      const vector2String = vectorArray2[j].map((elem) => elem.join(","));

      const sameVectors = vector1String.filter((vector) => vector2String.includes(vector));

      if (sameVectors.length >= 8) return [i, j];
    }
  }
}

function findBeacons(referenceScanner, searchScanner) {
  for (let i = 0; i < MAX_ROTATIONS; i++) {
    const rotatedScanner = rotateScanner(searchScanner, i);

    const referenceVectors = computeVectorsForPoints(referenceScanner);
    const searchVectors = computeVectorsForPoints(rotatedScanner);

    const foundMatch = matchVectorArrays(referenceVectors, searchVectors);
    if (foundMatch) {
      const referenceMatchPoint = referenceScanner[foundMatch[0]];
      const searchMatchPoint = rotatedScanner[foundMatch[1]];

      const offset = [
        referenceMatchPoint[0] - searchMatchPoint[0],
        referenceMatchPoint[1] - searchMatchPoint[1],
        referenceMatchPoint[2] - searchMatchPoint[2],
      ];

      return [offset, i];
    }
  }
}

function applyOffsetAndAdd(scanners, referenceScannerIdx, searchScannerIdx, rotation, offset) {
  const rotatedScanner = rotateScanner(scanners[searchScannerIdx], rotation);
  const newPoints = rotatedScanner.map(([x, y, z]) => [
    x + offset[0],
    y + offset[1],
    z + offset[2],
  ]);

  const toAddPoints = newPoints.filter((point) => {
    const strPoint = point.join(",");
    const referenceScannerStrPoints = scanners[referenceScannerIdx].map((elem) => elem.join(","));

    return !referenceScannerStrPoints.includes(strPoint);
  });

  const currentSize = scanners[referenceScannerIdx].length;
  scanners[referenceScannerIdx].push(...toAddPoints);
}

function normalizeScanners(scanners) {
  const reference = 0;
  const scannersPosition = [[0, 0, 0]];

  const leftScanners = [];
  for (let i = 1; i < scanners.length; i++) leftScanners.push(i);

  while (leftScanners.length > 0) {
    const nextScanner = leftScanners.shift();
    console.log("Testing on scanner " + nextScanner);

    const detectedOffset = findBeacons(scanners[reference], scanners[nextScanner]);
    if (!detectedOffset) {
      leftScanners.push(nextScanner);
      continue;
    }

    const [offset, rotation] = detectedOffset;
    const [x, y, z] = offset;
    scannersPosition[nextScanner] = [x, y, z];

    applyOffsetAndAdd(scanners, reference, nextScanner, rotation, offset);
  }

  return { scanners: scannersPosition, size: scanners[reference].length };
}

function calculateManhattanDistance(scanners) {
  let maxDistance = 0;

  for (let i = 0; i < scanners.length; i++) {
    for (let j = 0; j < scanners.length; j++) {
      if (i === j) continue;
      const distance =
        Math.abs(scanners[i][0] - scanners[j][0]) +
        Math.abs(scanners[i][1] - scanners[j][1]) +
        Math.abs(scanners[i][2] - scanners[j][2]);

      if (distance > maxDistance) maxDistance = distance;
    }
  }

  return maxDistance;
}

const scanners = buildScanners(lines);
const { scanners: positionedScanners, size } = normalizeScanners(scanners);
const maxDistance = calculateManhattanDistance(positionedScanners);

console.log("Total beacons:", size); // 330
console.log("Max distance:", maxDistance); // 9634
