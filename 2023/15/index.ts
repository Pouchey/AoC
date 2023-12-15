import { defaultTransform, parseLines, sum } from '../../utils';

type TBox = {
  id: number;
  lenses: TLense[];
};

type TLense = {
  id: string;
  focalLength: number;
};

type TOperation = {
  type: 'add' | 'remove';
  label: string;
  box: number;
  focalLength?: number;
};

const loadData = (input: string) => {
  const data = parseLines(input, defaultTransform<string>, /,/);
  const steps = data.flat().map((seq) => seq.split(''));
  return steps;
};

const hash = (step: string[]) => {
  return step.reduce((acc, step) => {
    const charCode = step.charCodeAt(0);
    return ((acc + charCode) * 17) % 256;
  }, 0);
};

export const solve1 = (input: string) => {
  const data = loadData(input);
  const seqs = data.map((step) => hash(step));
  return sum(seqs);
};

export const solve2 = (input: string) => {
  const data: TOperation[] = loadData(input)
    .map((step) => step.join(''))
    .map((seq) => {
      const op = seq.split(/=|-/).filter((s) => s);
      return {
        type: op.length === 2 ? 'add' : 'remove',
        label: op[0],
        box: hash(op[0].split('')),
        focalLength: op[1] ? parseInt(op[1]) : undefined
      };
    });

  const boxes: TBox[] = new Array(256).fill(0).map((_, i) => ({
    id: i,
    lenses: []
  }));

  for (const op of data) {
    if (op.type === 'remove') {
      const box = boxes.find((box) => box.id === op.box)!;
      box.lenses = box.lenses.filter((lense) => lense.id !== op.label);
    }
    if (op.type === 'add') {
      const box = boxes.find((box) => box.id === op.box)!;
      const hasLense = box?.lenses.find((lense) => lense.id === op.label);

      if (hasLense) {
        const lenseIndex = box.lenses.findIndex((lense) => lense.id === op.label);
        box.lenses[lenseIndex] = {
          id: op.label,
          focalLength: op.focalLength!
        };
      } else
        box.lenses.push({
          id: op.label,
          focalLength: op.focalLength!
        });
    }
  }

  const focusingPowers = boxes.map((box, boxIndex) => {
    const lensesPower = box.lenses.map(
      (lense, lenseIndex) => (boxIndex + 1) * (lenseIndex + 1) * lense.focalLength
    );
    return sum(lensesPower);
  });

  const result = sum(focusingPowers);

  return result;
};

export const exampleAnswer1 = 1320;
export const exampleAnswer2 = 145;

export const firstPartCompleted = true;
