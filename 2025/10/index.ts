import { defaultTransform, parseLines } from '../../utils';
import { bfs } from '../../utils/bfs';

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

export const solve2 = (input: string) => {
  const data = loadData(input);

  const createMatrix = (machine: TMachine) => {
    const matrix: boolean[][] = [];
    for (let i = 0; i < machine.lights.length; i++) {
      matrix.push([]);
      for (let j = 0; j < machine.buttons.length; j++) {
        if (machine.buttons[j].includes(i)) matrix[i].push(true);
        else matrix[i].push(false);
      }
    }
    return matrix;
  };

  const solveMachine = (machine: TMachine) => {
    const matrix = createMatrix(machine);
  };

  console.log(solveMachine(data[0]));

  const result = 0;

  return result;
};

export const exampleAnswer1 = 7;
export const exampleAnswer2 = 0;

export const firstPartCompleted = false;
