import { TRange, enumerate, parseBlocks, sum } from '../../utils';
import memoize from '../../utils/memoize';

enum ECategory {
  Cool = 'x',
  Musical = 'm',
  Aerodynamic = 'a',
  Shiny = 's'
}

enum EDest {
  Reject = 'R',
  Accept = 'A'
}

type TCondition = {
  category: ECategory;
  operator: '<' | '>';
  value: number;
};

type TRule = {
  condition?: TCondition;
  dest?: EDest | string;
};

type TWorkflow = {
  name: string;
  rules: TRule[];
};

type TRating = {
  x: number;
  m: number;
  a: number;
  s: number;
};

type TRatingRange = {
  x: TRange;
  m: TRange;
  a: TRange;
  s: TRange;
};

type TData = {
  workflows: TWorkflow[];
  ratings: TRating[];
};

const workflowRegex = /(?<name>\w+){(?<rules>.+)}/g;
const ratingRegex = /{(?<conditions>.+)}/g;

const conditionRegex = /(?<category>\w+)(?<operator>[<>])(?<value>\d+)/g;

const getCondition = memoize((condition: string): TCondition => {
  const matches = [...condition.matchAll(conditionRegex)][0];
  const { category, operator, value } = matches?.groups as {
    category: ECategory;
    operator: string;
    value: string;
  };
  return { category, operator: operator as '<' | '>', value: +value };
});

const loadData = (input: string): TData => {
  const [workflowsBlock, ratingsBlock] = parseBlocks(input);

  const wmatches = [...workflowsBlock.matchAll(workflowRegex)];
  const workflows = wmatches.map((match) => {
    const { name, rules } = match.groups as { name: string; rules: string };
    const rulesArray = rules.split(',').map((rule) => {
      const [firstPart, lastPart] = rule.split(':');
      if (!lastPart) {
        return { dest: firstPart };
      }
      return { condition: getCondition(firstPart), dest: lastPart };
    });

    return { name, rules: rulesArray };
  });

  const rmatches = [...ratingsBlock.matchAll(ratingRegex)];
  const ratings = rmatches.map((match) => {
    const { conditions } = match.groups as { conditions: string };
    const res = {
      x: 0,
      m: 0,
      a: 0,
      s: 0
    };

    conditions.split(',').forEach((condition) => {
      const [category, value] = condition.split('=');
      res[category as keyof TRating] = +value;
    });
    return res;
  });

  return {
    workflows,
    ratings
  };
};

const applyCondition = memoize((rule: TRule, rating: TRating) => {
  if (!rule.condition) return rule.dest;
  const { category, operator, value } = rule.condition;

  const ratingValue = rating[category];
  if (operator === '<') {
    return ratingValue < value ? rule.dest : undefined;
  } else if (operator === '>') {
    return ratingValue > value ? rule.dest : undefined;
  }
  throw new Error('Invalid operator');
});

const getWorkflowByName = memoize((workflows: TWorkflow[], name: string) => {
  return workflows.find((workflow) => workflow.name === name);
});

export const solve1 = (input: string) => {
  const data = loadData(input);

  const parts = data.ratings
    .map((rating) => {
      let currentSorting = 'in';
      do {
        let currentWorkflow = getWorkflowByName(data.workflows, currentSorting);
        if (!currentWorkflow) throw new Error('Invalid workflow');

        for (const rule of currentWorkflow.rules) {
          const dest = applyCondition(rule, rating);
          if (dest === EDest.Accept) return rating;
          if (dest === EDest.Reject) return;
          if (dest) {
            currentSorting = dest;
            break;
          }
        }
      } while (true);
    })
    .filter((part) => part !== undefined) as TRating[];

  const partsSum = parts.map((part) => part.x + part.m + part.a + part.s);

  const result = sum(partsSum);

  return result;
};

const RATING_RANGE_MIN = 1;
const RATING_RANGE_MAX = 4000;

export const getPaths = (workflows: TWorkflow[]): string[][] => {
  const paths: string[][] = [];
  const startWorkflow = getWorkflowByName(workflows, 'in')!;

  const dfs = (workflow: TWorkflow, path: string[] = []) => {
    for (const rule of workflow.rules) {
      if (rule.dest) {
        const newPath = [...path, rule.dest];
        if (rule.dest === 'R' || rule.dest === 'A') {
          paths.push(newPath);
        } else {
          const nextWorkflow = getWorkflowByName(workflows, rule.dest);
          if (nextWorkflow) {
            dfs(nextWorkflow, newPath);
          }
        }
      }
    }
  };
  dfs(startWorkflow, ['in']);
  return paths;
};

const getRange = (range: TRange, operator: string, value: number) => {
  if (operator === '<') {
    return [range[0], Math.min(range[1], value - 1)];
  } else if (operator === '>') {
    return [Math.max(range[0], value), range[1]];
  }
  throw new Error('Invalid operator');
};

export const getRanges = (
  workflows: TWorkflow[],
  path: string[],
  ranges = {
    x: [RATING_RANGE_MIN, RATING_RANGE_MAX],
    m: [RATING_RANGE_MIN, RATING_RANGE_MAX],
    a: [RATING_RANGE_MIN, RATING_RANGE_MAX],
    s: [RATING_RANGE_MIN, RATING_RANGE_MAX]
  }
): TRatingRange => {
  for (const [op, index] of enumerate(path)) {
    const workflow = getWorkflowByName(workflows, op)!;
    if (!workflow) continue;

    const rule = workflow.rules.find((rule) => rule.dest === path[index + 1])!;

    if (!rule?.condition) continue;

    const { category, operator, value } = rule.condition;
    const range = getRange(ranges[category] as TRange, operator, value);
    ranges[category] = range;
  }

  return ranges as TRatingRange;
};

export const solve2 = (input: string) => {
  const data = loadData(input);

  const paths = getPaths(data.workflows).filter((path) => path[path.length - 1] === 'A');
  const ranges: TRatingRange[] = [];
  // let actualRange: TRatingRange | undefined = undefined;
  for (const path of paths) {
    const range = getRanges(data.workflows, path);
    ranges.push(range);
    // actualRange = range;
  }

  const diffs = ranges.map((range) => {
    return {
      x: range.x[1] - range.x[0],
      m: range.m[1] - range.m[0],
      a: range.a[1] - range.a[0],
      s: range.s[1] - range.s[0]
    };
  });
  const totals = diffs.map((diff) => diff.x * diff.m * diff.a * diff.s);
  const result = sum(totals);

  return result;
};

export const exampleAnswer1 = 19114;
export const exampleAnswer2 = 167409079868000;

export const firstPartCompleted = true;
