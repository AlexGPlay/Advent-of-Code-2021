const fs = require("fs");

const lines = fs
  .readFileSync("./advent of code/adventofcode.com/12/input.txt")
  .toString()
  .split("\n")
  .map((entry) => entry.trim().split("-"));

const differentNodes = (function getDifferentNodes(paths) {
  const nodes = [];

  paths.forEach(([start, end]) => {
    nodes.push(start);
    nodes.push(end);
  });

  return [...new Set(nodes)];
})(lines);

const nodePosition = differentNodes.reduce((acc, curr, idx) => ({ ...acc, [curr]: idx }), {});

const adjacencyMatrix = (function buildAdjacencyMatrix(lines, nodes) {
  const matrix = [];
  for (let i = 0; i < nodes.length; i++) {
    matrix.push([]);
    for (let j = 0; j < nodes.length; j++) {
      matrix[i].push(0);
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const [start, end] = lines[i];

    const startIdx = nodePosition[start];
    const endIdx = nodePosition[end];

    matrix[startIdx][endIdx] = 1;
    matrix[endIdx][startIdx] = 1;
  }

  return matrix;
})(lines, differentNodes);

/**
 * Part 1
 */
function calculatePaths(startIdx, endIdx, alreadyVisitedPaths) {
  const availablePaths = adjacencyMatrix[startIdx];
  const visitedPaths = [...alreadyVisitedPaths];
  if (differentNodes[startIdx].toLowerCase() === differentNodes[startIdx])
    visitedPaths.push(startIdx);

  const compoundPath = [];

  for (let i = 0; i < availablePaths.length; i++) {
    if (!availablePaths[i] || visitedPaths.includes(i)) continue;
    if (i === endIdx) {
      compoundPath.push([endIdx]);
      continue;
    }

    const paths = calculatePaths(i, endIdx, visitedPaths).map((path) => [i, ...path]);
    compoundPath.push(...paths);
  }

  return compoundPath;
}

const paths = calculatePaths(nodePosition["start"], nodePosition["end"], []).map((path) => [
  nodePosition["start"],
  ...path,
]);

console.log(paths.length); // 3761

/**
 * Part 2
 */

function calculatePaths2(startIdx, endIdx, alreadyVisitedPaths, canVisit, canVisitCount) {
  const availablePaths = adjacencyMatrix[startIdx];
  const visitedPaths = [...alreadyVisitedPaths];
  if (
    differentNodes[startIdx].toLowerCase() === differentNodes[startIdx] &&
    nodePosition[canVisit] !== startIdx
  )
    visitedPaths.push(startIdx);

  const compoundPath = [];

  for (let i = 0; i < availablePaths.length; i++) {
    if (!availablePaths[i] || visitedPaths.includes(i)) continue;
    if (i === endIdx) {
      compoundPath.push([endIdx]);
      continue;
    }

    const paths = calculatePaths2(
      i,
      endIdx,
      visitedPaths,
      canVisitCount > 0 ? canVisit : null,
      canVisit && i !== nodePosition[canVisit] ? canVisitCount : canVisitCount - 1
    ).map((path) => [i, ...path]);
    compoundPath.push(...paths);
  }

  return compoundPath;
}

const stringifiedPart1Paths = paths.map((path) => path.join(""));
const allPaths = [];
const smallCaves = differentNodes.filter(
  (node) => node.toLowerCase() === node && node !== "start" && node !== "end"
);

for (let i = 0; i < smallCaves.length; i++) {
  const paths2 = calculatePaths2(
    nodePosition["start"],
    nodePosition["end"],
    [],
    smallCaves[i],
    1
  ).map((path) => [nodePosition["start"], ...path]);

  const filteredPaths2 = paths2.filter((path) => {
    const pathString = path.join("");
    return !stringifiedPart1Paths.includes(pathString);
  });

  allPaths.push(...filteredPaths2);
}

console.log(allPaths.length + paths.length); // 99138
