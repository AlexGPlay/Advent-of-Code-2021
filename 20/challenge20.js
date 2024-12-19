const fs = require("fs");

let lines = fs
  .readFileSync("./advent of code/adventofcode.com/20/input.txt")
  .toString()
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const algorithm = lines[0];
const input = lines.slice(1).map((line) => line.split(""));

function getPixelRepresentation(image, i, j, currentInfinite) {
  const pixels = [
    image[i - 1]?.[j - 1],
    image[i - 1]?.[j],
    image[i - 1]?.[j + 1],
    image[i][j - 1],
    image[i][j],
    image[i][j + 1],
    image[i + 1]?.[j - 1],
    image[i + 1]?.[j],
    image[i + 1]?.[j + 1],
  ].map((elem) => {
    if (elem === "#") return 1;
    if (elem === ".") return 0;

    if (currentInfinite === "#") return 1;
    if (currentInfinite === ".") return 0;
  });

  return parseInt(pixels.join(""), 2);
}

function increaseImageSize(image, currentInfinite) {
  const newImage = [];
  newImage.push(new Array(image[0].length + 2).fill(currentInfinite));

  for (let i = 0; i < image.length; i++) {
    newImage.push([currentInfinite, ...image[i], currentInfinite]);
  }

  newImage.push(new Array(image[0].length + 2).fill(currentInfinite));

  return newImage;
}

function processNewInfinite(currentInfinite) {
  const pixels = new Array(9).fill(currentInfinite).map((elem) => (elem === "#" ? 1 : 0));
  const representation = parseInt(pixels, 2);
  const fromAlgorithm = algorithm[representation];
  return fromAlgorithm;
}

function enhanceImage(image, algorithm, currentInfinite) {
  const newImage = increaseImageSize(image, currentInfinite);
  const reprocessedImage = [];

  for (let i = 0; i < newImage.length; i++) {
    reprocessedImage.push([]);
    for (let j = 0; j < newImage[i].length; j++) {
      const representation = getPixelRepresentation(newImage, i, j, currentInfinite);
      const fromAlgorithm = algorithm[representation];
      reprocessedImage[reprocessedImage.length - 1].push(fromAlgorithm);
    }
  }

  return [reprocessedImage, processNewInfinite(currentInfinite)];
}

function countLitPixels(image) {
  let litPixels = 0;

  for (let i = 0; i < image.length; i++) {
    for (let j = 0; j < image[i].length; j++) {
      if (image[i][j] === "#") {
        litPixels++;
      }
    }
  }

  return litPixels;
}

function printImage(image) {
  for (let i = 0; i < image.length; i++) {
    console.log(image[i].join(""));
  }
}

const times = 50; // set to 2 for part 1
let currentInfinite = ".";
let currentImage = input;

for (let i = 0; i < times; i++) {
  const [newImage, newInfinite] = enhanceImage(currentImage, algorithm, currentInfinite);
  currentImage = newImage;
  currentInfinite = newInfinite;
}

printImage(currentImage);

// 5291 for part 1
// 16665 for part 2
console.log("Lit pixels", countLitPixels(currentImage));
