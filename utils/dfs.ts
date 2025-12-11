export interface TDFSStack {
  state: string;
  steps: number;
}

export const dfs = <T>(
  start: string,
  goal: string,
  edges: T[],
  getNextStates: (node: T, state: string) => string
): number => {
  const stack: TDFSStack[] = [{ state: start, steps: 0 }];
  const visited: Set<string> = new Set([start]);

  while (stack.length > 0) {
    const { state, steps } = stack.pop()!;

    for (const node of edges) {
      const nextState = getNextStates(node, state);

      if (nextState === goal) return steps + 1;

      if (!visited.has(nextState)) {
        stack.push({ state: nextState, steps: steps + 1 });
        visited.add(nextState);
      }
    }
  }
  return -1;
};

export const dfsAllPaths = <T>(
  start: string,
  isGoal: (state: string) => boolean,
  edges: T[],
  getNextStates: (node: T, state: string) => string[]
): string[][] => {
  const paths: string[][] = [];

  const explore = (state: string, path: string[]) => {
    if (isGoal(state)) {
      paths.push([...path]);
      return;
    }

    for (const node of edges) {
      const nextStates = getNextStates(node, state);
      for (const nextState of nextStates) {
        if (!path.includes(nextState)) {
          explore(nextState, [...path, nextState]);
        }
      }
    }
  };

  explore(start, [start]);
  return paths;
};
