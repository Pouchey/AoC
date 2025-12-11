import { defaultTransform, parseLines } from '../../utils';

interface TGraph {
  [key: string]: string[];
}

const loadData = (input: string) => {
  const data = parseLines(input, defaultTransform<string>, /:/);

  const devices = data.map((line) => {
    const [name, outputs] = line;
    return { name, outputs: outputs.trim().split(' ') };
  });

  // create a graph of the devices
  const graph: TGraph = {};
  for (const device of devices) {
    graph[device.name] = device.outputs;
  }

  return graph;
};

export const solve1 = (input: string) => {
  const graph = loadData(input);

  const countPaths = (graph: TGraph, startKey: string, goalKey: string) => {
    let pathsCount = 0;
    const queue: string[] = [startKey];
    while (queue.length > 0) {
      console.log(queue);
      const current = queue.shift()!;
      if (current === goalKey) {
        pathsCount++;
        continue;
      }

      for (const neighbor of graph[current]) {
        queue.push(neighbor);
      }
    }

    return pathsCount;
  };

  const result = countPaths(graph, 'you', 'out');

  return result;
};

export const solve2 = (input: string) => {
  const data = loadData(input);

  const result = 0;

  return result;
};

export const exampleAnswer1 = 5;
export const exampleAnswer2 = 0;

export const firstPartCompleted = true;
