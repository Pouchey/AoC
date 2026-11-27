import { TRange, parseBlocks, sum } from '../../utils';
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
        const currentWorkflow = getWorkflowByName(data.workflows, currentSorting);
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

const rangeSize = ([min, max]: TRange) => Math.max(0, max - min + 1);

const countCombinations = (ranges: TRatingRange) =>
  rangeSize(ranges.x) * rangeSize(ranges.m) * rangeSize(ranges.a) * rangeSize(ranges.s);

/**
 * Split a range on a condition: the part that matches (sent to the rule's destination)
 * and the part that doesn't (continues to the next rule of the workflow).
 */
const splitRange = ([min, max]: TRange, { operator, value }: TCondition): [TRange, TRange] => {
  if (operator === '<') {
    return [
      [min, Math.min(max, value - 1)],
      [Math.max(min, value), max]
    ];
  }
  return [
    [Math.max(min, value + 1), max],
    [min, Math.min(max, value)]
  ];
};

const countAccepted = (workflows: TWorkflow[], name: string, ranges: TRatingRange): number => {
  if (countCombinations(ranges) === 0 || name === EDest.Reject) return 0;
  if (name === EDest.Accept) return countCombinations(ranges);

  const workflow = getWorkflowByName(workflows, name);
  if (!workflow) throw new Error(`Invalid workflow ${name}`);

  let total = 0;
  let remaining = ranges;
  for (const { condition, dest } of workflow.rules) {
    if (!dest) continue;
    if (!condition) {
      total += countAccepted(workflows, dest, remaining);
      break;
    }
    const [matching, notMatching] = splitRange(remaining[condition.category], condition);
    total += countAccepted(workflows, dest, { ...remaining, [condition.category]: matching });
    remaining = { ...remaining, [condition.category]: notMatching };
  }
  return total;
};

export const solve2 = (input: string) => {
  const data = loadData(input);

  const fullRange: TRange = [RATING_RANGE_MIN, RATING_RANGE_MAX];
  return countAccepted(data.workflows, 'in', {
    x: fullRange,
    m: fullRange,
    a: fullRange,
    s: fullRange
  });
};

export const exampleAnswer1 = 19114;
export const exampleAnswer2 = 167409079868000;

export const firstPartCompleted = true;
