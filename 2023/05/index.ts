import path from 'path';
import { readInput } from '../../utils/file';

const seedRegex = /seeds: ((\d+\s*)+)/g;
const mapRegex = /\w+-\w+-\w+ map:/g;
const mappingRegex = /(\d+) (\d+) (\d+)/g;

type Map = {
  src: number;
  dest: number;
  range: number;
};

const loadData = (input: string, range = false) => {
  const lines = input.split('\n');

  const seeds = [...lines[0].matchAll(seedRegex)][0][1]
    .split(' ')
    .map((seed) => parseInt(seed, 10));
  lines.shift();

  const maps: Map[][] = Array.from({ length: 7 }, () => []);

  let mapIndex = -1;
  lines.forEach((line) => {
    if (!line) return;
    if (mapRegex.test(line)) {
      mapIndex += 1;
      return;
    }

    const mapping = [...line.matchAll(mappingRegex)][0];
    const map = {
      dest: parseInt(mapping[1], 10),
      src: parseInt(mapping[2], 10),
      range: parseInt(mapping[3], 10)
    };

    maps[mapIndex].push(map);
  });

  return {
    seeds: seeds,
    maps
  };
};

const isSeedInRange = (seed: number, map: Map) => {
  return seed >= map.src && seed <= map.src + map.range;
};

export const solve1 = (input: string) => {
  const data = loadData(input);

  const mappedSeeds: number[][] = Array.from({ length: data.seeds.length }, () => []);
  data.seeds.forEach((seed, seedIndex) => {
    data.maps.forEach((mapRange, mapsIndex) => {
      const actual = mapsIndex === 0 ? seed : mappedSeeds[seedIndex][mapsIndex - 1];

      const map = mapRange.find((map) => isSeedInRange(actual, map));

      let mappedSeed = actual;
      if (map) {
        mappedSeed = map?.dest + (actual - map?.src);
      }

      mappedSeeds[seedIndex].push(mappedSeed);
    });
  });

  const locations = mappedSeeds.map((seed) => seed[6]);
  const result = Math.min(...locations);

  return result;
};

const intersectRange = ([start, end]: number[], map: Map) => {
  const mapStart = map.src;
  const mapEnd = map.src + map.range - 1;

  if (start > mapEnd || end < mapStart) return;
  if (start >= mapStart) {
    return end < mapEnd ? [start, end] : [start, mapEnd];
  }

  return end < mapEnd ? [mapStart, end] : [mapStart, mapEnd];
};

const mergeRanges = (ranges: number[][]) => {
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
};

export const solve2 = (input: string) => {
  const data = loadData(input, true);

  const rangedSeeds: number[][] = [];

  data.seeds.forEach((seed, index) => {
    if (index % 2 === 1) return;
    rangedSeeds.push([seed, seed + data.seeds[index + 1] - 1]);
  });

  let actualSeeds: number[][] = [...rangedSeeds];

  for (const map of data.maps) {
    let newSeeds: number[][] = [];
    for (const mapRange of map) {
      actualSeeds = actualSeeds
        .flatMap((rangedSeed) => {
          const range = intersectRange(rangedSeed, mapRange);
          if (!range) {
            return [rangedSeed];
          }

          newSeeds.push([range[0], range[1]].map((seed) => mapRange.dest + (seed - mapRange.src)));
          return [
            [rangedSeed[0], range[0] - 1],
            [range[1] + 1, rangedSeed[1]]
          ].filter(([first, last]) => first <= last);
        })
        .filter((range) => !!range) as number[][];
    }

    actualSeeds = mergeRanges(newSeeds.concat(actualSeeds));
  }

  const locations = actualSeeds.map((seed) => seed[0]);
  const result = Math.min(...locations);

  return result;
};

export const exampleAnswer1 = 35;
export const exampleAnswer2 = 46;

export const firstPartCompleted = true;
