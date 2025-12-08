export interface TPoint3D {
  x: number;
  y: number;
  z: number;
}

export const getDistance3D = (point1: TPoint3D, point2: TPoint3D) => {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) +
      Math.pow(point1.y - point2.y, 2) +
      Math.pow(point1.z - point2.z, 2)
  );
};
