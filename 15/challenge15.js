const fs = require("fs");

let lines = fs
  .readFileSync("./advent of code/adventofcode.com/15/input.txt")
  .toString()
  .split("\n")
  .map((line) =>
    line
      .trim()
      .split("")
      .map((elem) => parseInt(elem))
  );

// Comment this out for part 1
lines = (function increaseSize(lines, times) {
  for (let i = 0; i < lines.length; i++) {
    let line = [...lines[i]];
    for (let j = 0; j < times; j++) {
      const mappedLine = line.map((elem) => {
        const newValue = elem + j + 1;
        if (newValue > 9) return newValue - 9;
        return newValue;
      });
      lines[i].push(...mappedLine);
    }
  }

  const originalLength = lines.length;

  for (let i = 0; i < times; i++) {
    for (let j = 0; j < originalLength; j++) {
      const line = [...lines[j]];
      const mappedLine = line.map((elem) => {
        const newValue = elem + i + 1;
        if (newValue > 9) return newValue - 9;
        return newValue;
      });
      lines.push(mappedLine);
    }
  }

  return lines;
})(lines, 4);

function getAvailableNeighbours(i, j, lines) {
  const neighbours = [];

  if (lines[i]?.[j - 1]) neighbours.push([i, j - 1]);
  if (lines[i]?.[j + 1]) neighbours.push([i, j + 1]);
  if (lines[i - 1]?.[j]) neighbours.push([i - 1, j]);
  if (lines[i + 1]?.[j]) neighbours.push([i + 1, j]);

  return neighbours;
}

const nodes = (function buildNodes(lines) {
  const nodes = [];
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      nodes.push(`${i};${j}`);
    }
  }
  return nodes;
})(lines);

function getNode(node) {
  return nodes.indexOf(node);
}

function minimumCost(distances, visited) {
  let nextNode = -1;
  let minimumCost = Number.MAX_VALUE;

  for (let i = 0; i < visited.length; i++) {
    if (visited[i]) continue;
    if (distances[i] < minimumCost) {
      minimumCost = distances[i];
      nextNode = i;
    }
  }

  return nextNode;
}

function dijkstra(node) {
  const currentNode = getNode(node);

  if (currentNode === -1) return null;

  const distance = new Array(nodes.length);
  const visited = new Array(nodes.length).fill(false);

  const availableNeighbours = getAvailableNeighbours(
    ...node.split(";").map((elem) => parseInt(elem)),
    lines
  );

  for (let i = 0; i < nodes.length; i++) {
    const isAdjacent = availableNeighbours.some((node) => nodes[i] === `${node[0]};${node[1]}`);

    if (!isAdjacent) {
      distance[i] = Number.POSITIVE_INFINITY;
    } else {
      const [nI, nJ] = nodes[i].split(";").map((elem) => parseInt(elem));
      const weight = lines[nI][nJ];
      distance[i] = weight;
    }
  }

  visited[currentNode] = true;
  distance[currentNode] = 0;

  let nextNode = minimumCost(distance, visited);

  while (nextNode !== -1) {
    visited[nextNode] = true;

    const availableNeighbours = getAvailableNeighbours(
      ...nodes[nextNode].split(";").map((elem) => parseInt(elem)),
      lines
    );

    for (let availabeNeighbour of availableNeighbours) {
      const [nI, nJ] = availabeNeighbour;
      const weight = lines[nI][nJ];

      const appliedWeight = distance[nextNode] + weight;
      const nodeIdx = getNode(`${nI};${nJ}`);

      if (appliedWeight >= distance[nodeIdx]) continue;
      distance[nodeIdx] = appliedWeight;
    }

    nextNode = minimumCost(distance, visited);
  }

  return distance;
}

const distance = dijkstra(`0;0`);

// Part 1 => 609
// Part 2 => 2925
console.log(distance[distance.length - 1]);
