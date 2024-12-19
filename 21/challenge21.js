const fs = require("fs");

let lines = fs
  .readFileSync("./advent of code/adventofcode.com/21/input.txt")
  .toString()
  .split("\n")
  .map((line) => line.trim());

const player1Position = parseInt(lines[0].split(":")[1].trim());
const player2Position = parseInt(lines[1].split(":")[1].trim());

const DETERMINISTIC_DICE_MAX_NUMBER = 100;
const MAX_BOARD_SPACE = 10;
const DICE_SHOTS = 3;

function play(
  player1InitialPosition,
  player2InitialPosition,
  maxDiceNumber,
  maxBoardSpace,
  diceShots
) {
  const player1Data = { position: player1InitialPosition, shots: 0, score: 0 };
  const player2Data = { position: player2InitialPosition, shots: 0, score: 0 };

  let currentPlayer = player1Data;
  let currentDiceNumber = 1;

  while (player1Data.score < 1000 && player2Data.score < 1000) {
    let currentDiceValue = 0;
    for (let i = 0; i < diceShots; i++) {
      currentDiceValue += currentDiceNumber;
      currentDiceNumber++;
      if (currentDiceNumber > maxDiceNumber) currentDiceNumber = 1;
    }

    currentPlayer.shots += 3;
    currentPlayer.position += currentDiceValue;
    currentPlayer.position %= maxBoardSpace;
    currentPlayer.position = currentPlayer.position === 0 ? 10 : currentPlayer.position;

    currentPlayer.score += currentPlayer.position;

    currentPlayer = currentPlayer === player1Data ? player2Data : player1Data;
  }

  return {
    player1Data,
    player2Data,
    winner: player1Data.score > player2Data.score ? player1Data : player2Data,
    loser: player1Data.score > player2Data.score ? player2Data : player1Data,
  };
}

const { player1Data, player2Data, loser } = play(
  player1Position,
  player2Position,
  DETERMINISTIC_DICE_MAX_NUMBER,
  MAX_BOARD_SPACE,
  DICE_SHOTS
);

console.log((player1Data.shots + player2Data.shots) * loser.score); // 797160

/**
 * Part 2
 */
const POSSIBLE_COMBINATIONS = [
  3, 4, 5, 4, 5, 6, 5, 6, 7, 4, 5, 6, 5, 6, 7, 6, 7, 8, 5, 6, 7, 6, 7, 8, 7, 8, 9,
];

const CACHED_WINS = {};

function playWithDiracDice(player1Data, player2Data, currentPlayer) {
  const cacheKey = `T${currentPlayer};${player1Data.position}_${player1Data.score};${player2Data.position}_${player2Data.score}`;
  const currentPlayerData = currentPlayer === 0 ? player1Data : player2Data;

  if (CACHED_WINS[cacheKey]) {
    return CACHED_WINS[cacheKey];
  }

  const valueWinnerCount = [0, 0];

  for (let value of POSSIBLE_COMBINATIONS) {
    const combinationData = { ...currentPlayerData };

    combinationData.position += value;
    combinationData.position %= MAX_BOARD_SPACE;
    combinationData.position =
      combinationData.position === 0 ? MAX_BOARD_SPACE : combinationData.position;

    combinationData.score += combinationData.position;

    if (combinationData.score >= 21) {
      valueWinnerCount[currentPlayer]++;
      continue;
    }

    const nextPlayer = currentPlayer === 0 ? 1 : 0;
    const player1D = currentPlayer === 0 ? combinationData : player1Data;
    const player2D = currentPlayer === 0 ? player2Data : combinationData;

    const wins = playWithDiracDice(player1D, player2D, nextPlayer);

    valueWinnerCount[0] += wins[0];
    valueWinnerCount[1] += wins[1];
  }

  CACHED_WINS[cacheKey] = valueWinnerCount;
  return valueWinnerCount;
}

const player1DataPart2 = { position: player1Position, score: 0 };
const player2DataPart2 = { position: player2Position, score: 0 };

const wins = playWithDiracDice(player1DataPart2, player2DataPart2, 0);
console.log(Math.max(...wins)); // 27464148626406
