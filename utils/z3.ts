import { Arith, Model, Solver } from 'z3-solver';

export const buildCounterSum = (
  counters: Arith[],
  counterIndex: number,
  data: number[][],
  emptyValue: Arith
) => {
  const terms: Arith[] = [];
  for (let j = 0; j < data.length; j++) {
    if (data[j].includes(counterIndex)) {
      terms.push(counters[j]);
    }
  }

  if (terms.length === 0) return emptyValue;
  return terms.reduce((sum, press) => sum.add(press), emptyValue);
};

export const addConstraints = (
  solver: Solver,
  counters: Arith[],
  target: number[],
  data: number[][],
  emptyValue: Arith
) => {
  for (let i = 0; i < target.length; i++) {
    solver.add(buildCounterSum(counters, i, data, emptyValue).eq(target[i]));
  }
  for (const counter of counters) {
    solver.add(counter.ge(0));
  }
};

export const getSum = (model: Model, counters: Arith[]) => {
  return counters.reduce((sum, counter) => sum + Number(model.eval(counter).toString()), 0);
};
