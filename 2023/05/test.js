const path = require('path');
const fs = require('fs');
const readInput = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return data;
  } catch (error) {
    console.error(`Error reading input file: ${error}`);
    return '';
  }
};

function chunk(arr, len) {
  arr = [...arr];
  return [...Array(Math.ceil(arr.length / len))].map((_, i) => arr.slice(i * len, (i + 1) * len));
}
function mergeRanges(ranges) {
  ranges.sort(([min1], [min2]) => min1 - min2);
  const merged = [ranges[0]];
  for (const [min, max] of ranges.slice(1)) {
    const last = merged[merged.length - 1];
    if (min <= last[1] + 1) {
      last[1] = Math.max(max, last[1]);
    } else {
      merged.push([min, max]);
    }
  }
  return merged;
}

function intersectRanges([a, b], [c, d]) {
  if (a > d || b < c) return null;
  if (a >= c) {
    return b < d ? [a, b] : [a, d];
  }
  return b < d ? [c, b] : [c, d];
}
function solve() {
  const input = readInput(path.join(__dirname, 'data', 'input'));
  let [seeds, ...maps] = input.split('\n\n');

  seeds = chunk(
    seeds
      .split(': ')[1]
      .split(' ')
      .map((n) => +n),
    2
  ).map(([lo, len]) => [lo, lo + len - 1]);

  maps = maps.map((m) =>
    m
      .split(':\n')[1]
      .split('\n')
      .map((l) => l.split(' ').map((n) => +n))
  );

  for (const map of maps) {
    let newSeeds = [];
    for (const [to, from, len] of map) {
      seeds = seeds.flatMap((seedRange) => {
        const toMove = intersectRanges([from, from + len - 1], seedRange);
        if (!toMove) {
          return [seedRange];
        }
        newSeeds.push([toMove[0], toMove[1]].map((n) => n - from + to));
        return [
          [seedRange[0], toMove[0] - 1],
          [toMove[1] + 1, seedRange[1]]
        ].filter(([lo, hi]) => lo <= hi);
      });
    }
    seeds = mergeRanges(newSeeds.concat(seeds));
  }
  return Math.min(...seeds.map(([min]) => min));
}

const res = solve();
console.log(res);
