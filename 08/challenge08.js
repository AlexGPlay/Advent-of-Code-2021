const fs = require("fs");

const lines = fs
  .readFileSync("./advent of code/adventofcode.com/08/input.txt")
  .toString()
  .split("\n")
  .map((line) => {
    const [wires, output] = line.trim().split(" | ");
    return { wires: wires.split(" "), output: output.split(" ") };
  });

const neededSegments = [6, 2, 5, 5, 4, 5, 6, 3, 7, 6];

/**
 * Part 1
 */
const step1CountableSegments = [
  neededSegments[1],
  neededSegments[4],
  neededSegments[7],
  neededSegments[8],
];

let counter = 0;
lines.forEach(({ output }) => {
  const countableLines = output.filter((line) => step1CountableSegments.includes(line.length));
  counter += countableLines.length;
});

console.log(counter); // 512

/**
 * Part 2
 *
 * This part is executed by a backtracking algorithm that tries all combinations until it finds the correct one.
 *
 */
const numberRepresentation = [
  [1, 2, 3, null, 5, 6, 7],
  [null, null, 3, null, null, 6, null],
  [1, null, 3, 4, 5, null, 7],
  [1, null, 3, 4, null, 6, 7],
  [null, 2, 3, 4, null, 6, null],
  [1, 2, null, 4, null, 6, 7],
  [1, 2, null, 4, 5, 6, 7],
  [1, null, 3, null, null, 6, null],
  [1, 2, 3, 4, 5, 6, 7],
  [1, 2, 3, 4, null, 6, 7],
];

const differentDigitCount = {
  [neededSegments[1]]: 1,
  [neededSegments[4]]: 4,
  [neededSegments[7]]: 7,
  [neededSegments[8]]: 8,
};

const unknownDigitsOrder = [2, 3, 5, 6, 9, 0];

const representNumberFromCandidature = (candidature, wire) => {
  const mappedCandidature = Object.entries(candidature).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value.find(Boolean) }),
    {}
  );

  const mappedWireToSegments = wire
    .split("")
    .map((digit) => mappedCandidature[digit])
    .sort((a, b) => a - b);

  for (let i = 0; i < numberRepresentation.length; i++) {
    const representation = numberRepresentation[i].filter(Boolean);
    const isRepresentation = representation.every(
      (digit, index) => digit === mappedWireToSegments[index]
    );

    if (isRepresentation) return i;
  }

  return null;
};

const checkCandidature = (candidature, wires) => {
  const mappedCandidature = Object.entries(candidature).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value.find(Boolean) }),
    {}
  );

  const mappedWiresToSegments = wires.map((wire) =>
    wire
      .split("")
      .map((digit) => mappedCandidature[digit])
      .sort((a, b) => a - b)
  );

  for (let representation of numberRepresentation) {
    const cleanedRepresentation = representation.filter(Boolean);
    const commonRepresentation = mappedWiresToSegments.find((representation) => {
      return (
        representation.length === cleanedRepresentation.length &&
        representation.every((digit, index) => digit === cleanedRepresentation[index])
      );
    });

    if (!commonRepresentation) return false;
  }

  return true;
};

const mapFromKnownNumbers = (knownValues, candidatures) => {
  const orderedKnownNumbers = Object.keys(knownValues).sort(
    (a, b) => numberRepresentation[a].length - numberRepresentation[b].length
  );

  for (let knownNumber of orderedKnownNumbers) {
    const numberSegments = numberRepresentation[knownNumber];
    const numberWires = knownValues[knownNumber].split("");

    numberWires.forEach((wire) => {
      const currentCandidature = candidatures[wire];
      for (let i = 0; i < currentCandidature.length; i++) {
        if (currentCandidature[i] && !numberSegments[i]) currentCandidature[i] = null;
      }
    });

    Object.keys(candidatures).forEach((wire) => {
      if (numberWires.includes(wire)) return;
      const currentCandidature = candidatures[wire];
      for (let i = 0; i < currentCandidature.length; i++) {
        if (currentCandidature[i] && numberSegments[i]) currentCandidature[i] = null;
      }
    });
  }

  return candidatures;
};

const tryGuess = (currentCandidatures, wires, number) => {
  const numberSegments = numberRepresentation[number];

  const possibleCombinations = wires
    .filter((wire) => wire.length === numberSegments.filter(Boolean).length)
    .filter((combination) => {
      const combinationSegments = combination.split("");
      for (let wire of combinationSegments) {
        const candidateWires = currentCandidatures[wire];
        const hasAny = candidateWires.some((candidate) => numberSegments.includes(candidate));
        if (!hasAny) return false;
      }

      return true;
    });

  for (let combination of possibleCombinations) {
    const candidature = {};
    Object.entries(currentCandidatures).forEach(([wire, candidatureWire]) => {
      candidature[wire] = [...candidatureWire];
    });

    const testedCandidature = mapFromKnownNumbers({ [number]: combination }, candidature);
    if (
      Object.values(testedCandidature).every((array) => array.filter(Boolean).length === 1) &&
      checkCandidature(testedCandidature, wires)
    )
      return testedCandidature;

    if (Object.values(testedCandidature).some((array) => array.filter(Boolean).length === 0))
      continue;

    const nextValue = unknownDigitsOrder.findIndex((digit) => digit === number) + 1;
    if (!unknownDigitsOrder[nextValue]) return null;

    const guess = tryGuess(testedCandidature, wires, unknownDigitsOrder[nextValue]);
    if (
      Object.values(guess).every((array) => array.filter(Boolean).length === 1) &&
      checkCandidature(guess, wires)
    )
      return guess;
  }

  return null;
};

const mappedOutputs = lines.map(({ wires, output }) => {
  const knownMappedData = wires.reduce((acc, line) => {
    const number = differentDigitCount[line.length];
    if (!number || acc[number]) return acc;
    acc[number] = line;
    return acc;
  }, {});

  const defaultCandidatures = {
    a: [1, 2, 3, 4, 5, 6, 7],
    b: [1, 2, 3, 4, 5, 6, 7],
    c: [1, 2, 3, 4, 5, 6, 7],
    d: [1, 2, 3, 4, 5, 6, 7],
    e: [1, 2, 3, 4, 5, 6, 7],
    f: [1, 2, 3, 4, 5, 6, 7],
    g: [1, 2, 3, 4, 5, 6, 7],
  };

  const candidaturesFromKnownData = mapFromKnownNumbers(knownMappedData, defaultCandidatures);
  const guess = tryGuess(candidaturesFromKnownData, wires, unknownDigitsOrder[0]);
  if (!guess) return;

  const mappedData = Object.entries(guess).reduce(
    (acc, [wire, value]) => ({ ...acc, [wire]: value.find(Boolean) }),
    {}
  );

  const mappedOutput = output.map((line) => representNumberFromCandidature(guess, line));
  return parseInt(mappedOutput.join(""));
});

console.log(mappedOutputs.reduce((acc, value) => acc + value, 0)); // 1091165
