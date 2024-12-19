const fs = require("fs");

const lines = fs.readFileSync("input.txt").toString().split("\n");

const chosenNumbers = lines[0].split(",");
let boards = [];
let numberBoards = {};
let boardCount = 0;

function loadData() {
  boards = [];
  numberBoards = {};
  boardCount = 0;

  for (let i = 2; i < lines.length; i++) {
    if (!lines[i].trim()) {
      const board = boards[boardCount];
      board.forEach((line, lineIdx) =>
        line.forEach((number, colIdx) => {
          if (!numberBoards[number.value]) numberBoards[number.value] = [];
          numberBoards[number.value].push({ boardId: boardCount, lineIdx, colIdx });
        })
      );

      boardCount++;
      continue;
    }
    if (!boards[boardCount]) boards[boardCount] = [];
    boards[boardCount].push(
      lines[i]
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((elem) => ({ value: elem, selected: false }))
    );
  }
}

/**
 * Helper Methods
 */

const checkBoardLine = (board, lineIdx) => {
  for (let i = 0; i < board.length; i++) {
    if (!board[lineIdx][i].selected) return false;
  }

  return true;
};

const checkBoardCol = (board, colIdx) => {
  for (let i = 0; i < board.length; i++) {
    if (!board[i][colIdx].selected) return false;
  }

  return true;
};

const calculateWinPoints = (board, winNumber) => {
  let winPoints = 0;

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (!board[i][j].selected) {
        winPoints += parseInt(board[i][j].value);
      }
    }
  }

  return winPoints * winNumber;
};

/**
 * Part 1
 */

loadData();
(function () {
  for (let i = 0; i < chosenNumbers.length; i++) {
    const number = chosenNumbers[i];
    const selectedNumberBoards = numberBoards[number];

    if (!selectedNumberBoards) continue;
    for (let { boardId, lineIdx, colIdx } of selectedNumberBoards) {
      const board = boards[boardId];
      board[lineIdx][colIdx].selected = true;

      if (checkBoardLine(board, lineIdx) || checkBoardCol(board, colIdx)) {
        const points = calculateWinPoints(board, number);
        console.log(points); // 38594
        return;
      }
    }
  }
})();

/**
 * Part 2
 */
let lastWinPoints = 0;

loadData();
for (let i = 0; i < chosenNumbers.length; i++) {
  const number = chosenNumbers[i];
  const selectedNumberBoards = numberBoards[number];

  if (!selectedNumberBoards) continue;
  for (let { boardId, lineIdx, colIdx } of selectedNumberBoards) {
    const board = boards[boardId];
    board[lineIdx][colIdx].selected = true;

    if (checkBoardLine(board, lineIdx) || checkBoardCol(board, colIdx)) {
      const points = calculateWinPoints(board, number);
      lastWinPoints = points;

      Object.keys(numberBoards).forEach((id) => {
        const boards = numberBoards[id];
        numberBoards[id] = boards.filter((elem) => elem.boardId !== boardId);
      });
    }
  }
}

console.log(lastWinPoints); // 21184
