export interface TBFSQueue {
  state: string;
  steps: number;
}

export const bfs = <T>(
  start: string,
  goal: string,
  edges: T[],
  getNextStates: (node: T, state: string) => string
): number => {
  const queue: TBFSQueue[] = [{ state: start, steps: 0 }];
  const visited: Set<string> = new Set([start]);

  while (queue.length > 0) {
    const { state, steps } = queue.shift()!;

    for (const node of edges) {
      const nextState = getNextStates(node, state);

      if (nextState === goal) return steps + 1;

      if (!visited.has(nextState)) {
        queue.push({ state: nextState, steps: steps + 1 });
        visited.add(nextState);
      }
    }
  }
  return -1;
};
