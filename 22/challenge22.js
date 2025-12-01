const fs = require("fs");

const parseLines = (lines) => {
  return lines.map((line) => {
    const regexp =
      /(?<operation>on|off) x=(?<x1>-?\d+)..(?<x2>-?\d+),y=(?<y1>-?\d+)..(?<y2>-?\d+),z=(?<z1>-?\d+)..(?<z2>-?\d+)/;
    const match = line.match(regexp);
    if (!match) throw new Error(`Line did not match regex: ${line}`);
    const { operation, x1, x2, y1, y2, z1, z2 } = match.groups;
    return {
      on: operation === "on",
      x1: parseInt(x1, 10),
      x2: parseInt(x2, 10),
      y1: parseInt(y1, 10),
      y2: parseInt(y2, 10),
      z1: parseInt(z1, 10),
      z2: parseInt(z2, 10),
    };
  });
};

const part1 = (instructions) => {
  const onPositions = new Set();
  const LOW = -50;
  const HIGH = 50;

  for (const instr of instructions) {
    if (
      instr.x2 < LOW ||
      instr.x1 > HIGH ||
      instr.y2 < LOW ||
      instr.y1 > HIGH ||
      instr.z2 < LOW ||
      instr.z1 > HIGH
    ) {
      continue;
    }

    // Now clamp because we know there's overlap
    const x1 = Math.max(instr.x1, LOW);
    const x2 = Math.min(instr.x2, HIGH);
    const y1 = Math.max(instr.y1, LOW);
    const y2 = Math.min(instr.y2, HIGH);
    const z1 = Math.max(instr.z1, LOW);
    const z2 = Math.min(instr.z2, HIGH);

    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        for (let z = z1; z <= z2; z++) {
          const key = `${x},${y},${z}`;
          if (instr.on) onPositions.add(key);
          else onPositions.delete(key);
        }
      }
    }
  }

  console.log(onPositions.size);
};

const part2 = (instructions) => {
  const cuboids = [];

  for (const instruction of instructions) {
    const updates = [];

    for (const cuboid of cuboids) {
      const intersection = intersect(cuboid, instruction);
      if (!intersection) continue;
      updates.push({
        ...intersection,
        sign: -cuboid.sign,
      });
    }

    cuboids.push(...updates);
    if (!instruction.on) continue;

    cuboids.push({
      ...instruction,
      sign: 1,
    });
  }

  let total = BigInt(0);
  for (const cuboid of cuboids) total += BigInt(cuboid.sign) * volume(cuboid);

  console.log(total.toString());
};

const intersect = (a, b) => {
  const x1 = Math.max(a.x1, b.x1);
  const x2 = Math.min(a.x2, b.x2);
  const y1 = Math.max(a.y1, b.y1);
  const y2 = Math.min(a.y2, b.y2);
  const z1 = Math.max(a.z1, b.z1);
  const z2 = Math.min(a.z2, b.z2);

  if (x1 > x2 || y1 > y2 || z1 > z2) return null;

  return { x1, x2, y1, y2, z1, z2 };
};

const volume = (cuboid) =>
  BigInt(cuboid.x2 - cuboid.x1 + 1) *
  BigInt(cuboid.y2 - cuboid.y1 + 1) *
  BigInt(cuboid.z2 - cuboid.z1 + 1);

const solve = () => {
  const lines = fs.readFileSync("input.txt", "utf-8").split("\n");
  const parsedLines = parseLines(lines);

  part1(parsedLines);
  part2(parsedLines);
};

solve();
