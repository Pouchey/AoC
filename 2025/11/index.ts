import { defaultTransform, parseLines } from '../../utils';
import memoize from '../../utils/memoize';

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
  const graph = loadData(input);

  const memo = new Map<string, number>();

  const dfs = (
    node: string,
    goal: string,
    hasDac: boolean,
    hasFft: boolean,
    pathSet: Set<string>
  ): number => {
    const memoKey = `${node}|${hasDac}|${hasFft}`;

    if (!pathSet.has(node) && memo.has(memoKey)) {
      return memo.get(memoKey)!;
    }

    const newHasDac = hasDac || node === 'dac';
    const newHasFft = hasFft || node === 'fft';
    if (pathSet.has(node)) return 0;

    if (node === goal) {
      const result = newHasDac && newHasFft ? 1 : 0;
      if (!pathSet.has(node) && newHasDac && newHasFft) memo.set(memoKey, 1);
      return result;
    }

    const newPathSet = new Set(pathSet);
    newPathSet.add(node);

    const total = graph[node].reduce(
      (acc, neighbor) => acc + dfs(neighbor, goal, newHasDac, newHasFft, newPathSet),
      0
    );

    if (!pathSet.has(node)) {
      memo.set(memoKey, total);
    }

    return total;
  };

  const result = dfs('svr', 'out', false, false, new Set());
  return result;
};

export const exampleAnswer1 = 5;
export const exampleAnswer2 = 2;

export const firstPartCompleted = true;
