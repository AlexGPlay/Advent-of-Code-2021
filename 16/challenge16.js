const fs = require("fs");

let line = fs.readFileSync("./advent of code/adventofcode.com/16/input.txt").toString().trim();

const outerPacket = line
  .split("")
  .map((x) => parseInt(x, 16).toString(2).padStart(4, "0"))
  .join("");

const VERSION_LENGTH = 3;
const TYPE_ID_LENGTH = 3;
const PACKET_LENGTH = 5;

let versionAccumulator = 0;

const typeOperations = {
  0: (...args) => args.reduce((a, b) => a + b, 0),
  1: (...args) => args.reduce((a, b) => a * b, 1),
  2: (...args) => Math.min(...args),
  3: (...args) => Math.max(...args),
  5: (packet1, packet2) => (packet1 > packet2 ? 1 : 0),
  6: (packet1, packet2) => (packet1 < packet2 ? 1 : 0),
  7: (packet1, packet2) => (packet1 === packet2 ? 1 : 0),
};

function parsePacket(packet, idx) {
  const version = parseInt(packet.substring(idx, idx + VERSION_LENGTH), 2);
  idx += VERSION_LENGTH;

  const typeId = parseInt(packet.substring(idx, idx + TYPE_ID_LENGTH), 2);
  idx += TYPE_ID_LENGTH;

  versionAccumulator += version;

  return {
    version,
    typeId,
    subpackets:
      typeId === 4 ? getValuesForType4(packet, idx) : getValuesForOtherType(packet, idx, typeId),
  };
}

function getValuesForType4(packet, idx) {
  const packets = [];

  while (true) {
    packets.push(packet.substring(idx + 1, idx + PACKET_LENGTH));
    const firstChar = packet.charAt(idx);
    idx += PACKET_LENGTH;

    if (firstChar === "0") break;
  }

  return {
    packets: packets.join(""),
    value: parseInt(packets.join(""), 2),
    newIdx: idx,
  };
}

function getValuesForOtherType(packet, idx, typeId) {
  const lengthTypeId = packet.charAt(idx);
  idx += 1;

  if (lengthTypeId === "0") return getValuesForLengthTypeZero(packet, idx, typeId);
  else return getValuesForLengthTypeOne(packet, idx, typeId);
}

function getValuesForLengthTypeZero(packet, idx, typeId) {
  const LENGTH_BITS = 15;

  const length = parseInt(packet.substring(idx, idx + LENGTH_BITS), 2);
  idx += LENGTH_BITS;

  const packets = [];
  let currentLength = 0;

  while (currentLength < length) {
    const newPacket = parsePacket(packet, idx);
    packets.push(newPacket);
    currentLength += newPacket.subpackets.newIdx - idx;
    idx = newPacket.subpackets.newIdx;
  }

  return {
    packets,
    newIdx: idx,
    value: typeOperations[typeId](...packets.map((packet) => packet.subpackets.value)),
  };
}

function getValuesForLengthTypeOne(packet, idx, typeId) {
  const LENGTH_BITS = 11;

  const length = parseInt(packet.substring(idx, idx + LENGTH_BITS), 2);
  idx += LENGTH_BITS;

  const packets = [];

  while (packets.length < length) {
    const newPacket = parsePacket(packet, idx);
    packets.push(newPacket);
    idx = newPacket.subpackets.newIdx;
  }

  return {
    packets,
    newIdx: idx,
    value: typeOperations[typeId](...packets.map((packet) => packet.subpackets.value)),
  };
}

const packet = parsePacket(outerPacket, 0);
console.log(versionAccumulator); // 925
console.log(packet.subpackets.value); // 342997120375
