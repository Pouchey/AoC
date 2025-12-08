import { defaultTransform, parseLines } from '../../utils';
import { TPoint3D, getDistance3D } from '../../utils/3d';

interface TPointWithIndex extends TPoint3D {
  index: number;
}

interface TDistance {
  distance: number;
  point1Index: number;
  point2Index: number;
}

const loadData = (input: string) => {
  const data = parseLines(input, defaultTransform, /\s+/);

  const points: TPointWithIndex[] = data.map((line, index) => {
    const [x, y, z] = line[0].split(',').map(Number);
    return { x: +x, y: +y, z: +z, index };
  });

  return points;
};

const getCircuits = (data: TPointWithIndex[], limit?: number) => {
  // creating a array of distances for all pairs of points
  const distances: TDistance[] = data
    .map((point1) => {
      return data.map((point2) => {
        if (point1.index === point2.index) return null;
        if (point1.index > point2.index) return null;
        return {
          distance: getDistance3D(point1, point2),
          point1Index: point1.index,
          point2Index: point2.index
        };
      });
    })
    .flat()
    .filter((distance) => distance !== null) as TDistance[];

  const sortedDistances = distances.sort((a, b) => a.distance - b.distance);
  let circuits: number[][] = data.map((point) => [point.index]);

  const limitedDistances = limit ? sortedDistances.slice(0, limit) : sortedDistances;
  let lastDistance: TDistance | undefined = undefined;

  for (const distance of limitedDistances) {
    const foundCircuits = circuits.filter(
      (circuit) => circuit.includes(distance.point1Index) || circuit.includes(distance.point2Index)
    );

    // if there are more than one circuit, merge them
    if (foundCircuits.length > 1) {
      const circuit1 = foundCircuits[0];
      const circuit2 = foundCircuits[1];
      const newCircuit = [...circuit1, ...circuit2];
      circuits = circuits.filter(
        (c) => !c.includes(distance.point1Index) && !c.includes(distance.point2Index)
      );
      circuits.push(newCircuit);
    }

    // get the only one circuit, add the points to it
    let circuit = circuits.find(
      (c) => c.includes(distance.point1Index) || c.includes(distance.point2Index)
    );

    if (circuit) {
      if (!circuit.includes(distance.point1Index)) circuit.push(distance.point1Index);
      if (!circuit.includes(distance.point2Index)) circuit.push(distance.point2Index);
    }
    lastDistance = distance;

    if (circuits.length === 1) {
      break;
    }
  }

  return { circuits, lastDistance };
};

export const solve1 = (input: string) => {
  const data = loadData(input);
  let circuitCycleLimit = data.length === 20 ? 10 : 1000;

  const { circuits } = getCircuits(data, circuitCycleLimit);

  const circuitsLengths = circuits.map((circuit) => circuit.length);
  const sortedCircuitsLengths = circuitsLengths.sort((a, b) => b - a);

  const result = sortedCircuitsLengths.slice(0, 3).reduce((acc, length) => acc * length, 1);

  return result;
};

export const solve2 = (input: string) => {
  const data = loadData(input);

  const { lastDistance } = getCircuits(data);

  const points1 = data.find((point) => point.index === lastDistance?.point1Index);
  const points2 = data.find((point) => point.index === lastDistance?.point2Index);

  const result = points1!.x * points2!.x;

  return result;
};

export const exampleAnswer1 = 40;
export const exampleAnswer2 = 25272;

export const firstPartCompleted = true;
