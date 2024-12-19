const fs = require("fs");

let lines = fs
  .readFileSync("./advent of code/adventofcode.com/18/input.txt")
  .toString()
  .split("\n");

let currentNumber = null;

function buildNumber(parent, number, depth = 0) {
  if (!Array.isArray(number)) return number;

  const node = {
    parent,
    depth,
  };

  node.left = buildNumber(node, number[0], depth + 1);
  node.right = buildNumber(node, number[1], depth + 1);

  return node;
}

function propagateDepths(node, depth) {
  if (!node) return;

  node.depth = depth;

  propagateDepths(node.left, depth + 1);
  propagateDepths(node.right, depth + 1);
}

function addNumbers(node1, node2) {
  const finalNode = {
    depth: 0,
    left: node1,
    right: node2,
  };

  node1.parent = finalNode;
  node2.parent = finalNode;

  propagateDepths(node1, 1);
  propagateDepths(node2, 1);

  return finalNode;
}

function getValidParentFor(node, side, reference) {
  let checkNode = node;
  let parent = node.parent;

  while (true) {
    const hasSide = parent[side] !== null && parent[side] !== checkNode;
    if (hasSide) return parent;
    if (parent === reference) break;
    checkNode = parent;
    parent = parent.parent;
  }

  return null;
}

function findAndApply(node, side, applyCount) {
  const oppositeSide = side === "right" ? "left" : "right";
  if (typeof node[side] === "number") {
    node[side] += applyCount;
    return;
  }

  let baseNode = node[side];
  while (true) {
    if (typeof baseNode[oppositeSide] === "number") {
      baseNode[oppositeSide] += applyCount;
      return;
    }
    baseNode = baseNode[oppositeSide];
  }
}

function checkDepthRule(node, reference) {
  const obtainLeft = getValidParentFor(node, "left", reference);
  const obtainRight = getValidParentFor(node, "right", reference);

  if (obtainLeft) findAndApply(obtainLeft, "left", node.left);
  if (obtainRight) findAndApply(obtainRight, "right", node.right);

  node.parent.left === node ? (node.parent.left = 0) : (node.parent.right = 0);
}

function checkSplitRule(node) {
  const dir = typeof node.left === "number" && node.left >= 10 ? "left" : "right";

  const left = Math.floor(node[dir] / 2);
  const right = Math.ceil(node[dir] / 2);

  node[dir] = {
    depth: node.depth + 1,
    parent: node,
    left,
    right,
  };
}

function findProblem(node, problem) {
  if (problem === "depth" && node.depth >= 4) return { node, reason: "depth" };
  if (problem === "split" && typeof node.left === "number" && node.left >= 10)
    return { node, reason: "split" };

  if (typeof node.left === "object") {
    const foundProblem = findProblem(node.left, problem);
    if (foundProblem) return foundProblem;
  }

  if (problem === "split" && typeof node.right === "number" && node.right >= 10)
    return { node, reason: "split" };

  if (typeof node.right === "object") {
    const foundProblem = findProblem(node.right, problem);
    if (foundProblem) return foundProblem;
  }
}

function calculateMagintude(node) {
  if (typeof node === "number") return node;
  return calculateMagintude(node.left) * 3 + calculateMagintude(node.right) * 2;
}

// Helper method to print the current number in each step
function nodesToString(node) {
  let nodeString = "[";

  if (typeof node.left === "object") nodeString += nodesToString(node.left);
  else nodeString += node.left;

  nodeString += ",";

  if (typeof node.right === "object") nodeString += nodesToString(node.right);
  else nodeString += node.right;

  return nodeString + "]";
}

function addNumbersAndSolve(number1, number2) {
  const newNode = addNumbers(number1, number2);

  // Un comment console logs if you want the in-depth info of what is happening
  // console.log("After addition: ", nodesToString(newNode));

  while (true) {
    const nextElement = findProblem(newNode, "depth") || findProblem(newNode, "split");
    if (!nextElement) break;

    if (nextElement.reason === "depth") {
      checkDepthRule(nextElement.node, newNode);
      // console.log("After explode:", nodesToString(newNode));
    } else if (nextElement.reason === "split") {
      checkSplitRule(nextElement.node);
      // console.log("After split:", nodesToString(newNode));
    }
  }

  propagateDepths(newNode, 0);

  return newNode;
}

for (let line of lines) {
  const node = buildNumber(null, eval(line.trim()));
  if (!currentNumber) {
    currentNumber = node;
    continue;
  }

  const newNode = addNumbersAndSolve(currentNumber, node);
  currentNumber = newNode;
}

console.log("Magnitude", calculateMagintude(currentNumber)); // 3051

/**
 * For part 2
 */
let maxMagintude = 0;

for (let i = 0; i < lines.length; i++) {
  for (let j = 0; j < lines.length; j++) {
    if (i === j) continue;

    const number1 = buildNumber(null, eval(lines[i].trim()));
    const number2 = buildNumber(null, eval(lines[j].trim()));

    const result = addNumbersAndSolve(number1, number2);
    const resultMagnitude = calculateMagintude(result);
    if (resultMagnitude > maxMagintude) maxMagintude = resultMagnitude;
  }
}

console.log("Max magnitude", maxMagintude); // 4812
