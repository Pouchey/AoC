import { bfs } from '../../utils/bfs';
import { Arith, Solver, init } from 'z3-solver';
import { addConstraints, getSum } from '../../utils/z3';

enum ELight {
  Off = '.',
  On = '#'
}

interface TMachine {
  lights: ELight[];
  buttons: number[][];
  joltages: number[];
}

const loadData = (input: string) => {
  const data = input.split('\n').map((line) => {
    let machine: TMachine = {
      lights: [],
      buttons: [],
      joltages: []
    };
    const parts = line.split(' ').map((part) => {
      if (part.includes('[') && part.includes(']')) {
        return {
          type: 'light',
          value: part.slice(1, -1)
        };
      }
      if (part.includes('(') && part.includes(')')) {
        return {
          type: 'button',
          value: part.slice(1, -1)
        };
      }
      if (part.includes('{') && part.includes('}')) {
        return {
          type: 'joltages',
          value: part.slice(1, -1)
        };
      }
      throw new Error(`Invalid part: ${part}`);
    });

    for (const part of parts) {
      if (part.type === 'light') {
        machine.lights.push(...part.value.split('').map((light) => light as ELight));
      }
      if (part.type === 'button') {
        machine.buttons.push(
          ...part.value.split(' ').map((button) => button.split(',').map((button) => +button))
        );
      }
      if (part.type === 'joltages') {
        machine.joltages.push(...part.value.split(',').map((joltage) => +joltage));
      }
    }

    return machine;
  });

  return data;
};

export const solve1 = (input: string) => {
  const data = loadData(input);

  const solveMachine = (machine: TMachine) => {
    const goal = machine.lights.join('');
    const start = new Array(machine.lights.length).fill('.').join('');

    const switchLight = (button: number[], state: string) => {
      return state
        .split('')
        .map((light, index) => {
          if (button.includes(index)) return light === '.' ? '#' : '.';
          return light;
        })
        .join('');
    };

    const result = bfs(start, goal, machine.buttons, switchLight);
    return result;
  };

  const result = data.map(solveMachine).reduce((acc, curr) => acc + curr, 0);

  return result;
};

export const solve2 = async (input: string) => {
  const data = loadData(input);
  const { Context } = await init();
  const { Solver, Int } = Context('main');

  // Solve linear system: A × x = b where:
  // - A[i][j] = 1 if button j affects counter i, else 0
  // - x is the vector of button press counts (what we solve for)
  // - b is the target joltage vector

  const solveMachine = async (machine: TMachine) => {
    const buttonsLength = machine.buttons.length;
    const buttonPresses = Array.from({ length: buttonsLength }, (_, i) => Int.const(`x${i}`));

    const totalPresses = buttonPresses.reduce((sum, press) => sum.add(press), Int.val(0));

    const solver = new Solver();
    addConstraints(solver, buttonPresses, machine.joltages, machine.buttons, Int.val(0));

    if ((await solver.check()) !== 'sat') {
      throw new Error('No solution exists');
    }

    let bestSum = getSum(solver.model(), buttonPresses);
    let upperBound = bestSum - 1;

    while (upperBound >= 0) {
      const testSolver = new Solver();
      addConstraints(testSolver, buttonPresses, machine.joltages, machine.buttons, Int.val(0));
      testSolver.add(totalPresses.le(upperBound));

      if ((await testSolver.check()) === 'sat') {
        bestSum = getSum(testSolver.model(), buttonPresses);
        upperBound = bestSum - 1;
      } else {
        break;
      }
    }

    return bestSum;
  };

  let result = 0;
  for (const machine of data) {
    result += await solveMachine(machine);
  }
  return result;
};

export const exampleAnswer1 = 7;
export const exampleAnswer2 = 33;

export const firstPartCompleted = true;
