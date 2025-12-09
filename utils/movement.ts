import memoize from './memoize';

export enum EDirection {
  Left = 'L',
  Right = 'R',
  Top = 'T',
  Bottom = 'B'
}

export enum ECardinalDirection {
  North = 'N',
  South = 'S',
  East = 'E',
  West = 'W',
  NorthEast = 'NE',
  SouthEast = 'SE',
  SouthWest = 'SW',
  NorthWest = 'NW'
}

export enum ECardinalDirectionShort {
  North = 'N',
  South = 'S',
  East = 'E',
  West = 'W'
}

export interface TPoint {
  x: number;
  y: number;
}

export const move = memoize(
  <T>(tile: TPoint, data: T[][], direction: ECardinalDirection, isInfinite = false) => {
    const maxX = data[0].length - 1;
    const maxY = data.length - 1;

    let newX = tile.x;
    let newY = tile.y;

    switch (direction) {
      case ECardinalDirection.North:
        newY = tile.y - 1;
        if (!isInfinite && newY < 0) return null;
        break;
      case ECardinalDirection.South:
        newY = tile.y + 1;
        if (!isInfinite && newY > maxY) return null;
        break;
      case ECardinalDirection.East:
        newX = tile.x + 1;
        if (!isInfinite && newX > maxX) return null;
        break;
      case ECardinalDirection.West:
        newX = tile.x - 1;
        if (!isInfinite && newX < 0) return null;
        break;
      case ECardinalDirection.NorthEast:
        newX = tile.x + 1;
        newY = tile.y - 1;
        if (!isInfinite && (newX > maxX || newY < 0)) return null;
        break;
      case ECardinalDirection.SouthEast:
        newX = tile.x + 1;
        newY = tile.y + 1;
        if (!isInfinite && (newX > maxX || newY > maxY)) return null;
        break;
      case ECardinalDirection.SouthWest:
        newX = tile.x - 1;
        newY = tile.y + 1;
        if (!isInfinite && (newX < 0 || newY > maxY)) return null;
        break;
      case ECardinalDirection.NorthWest:
        newX = tile.x - 1;
        newY = tile.y - 1;
        if (!isInfinite && (newX < 0 || newY < 0)) return null;
        break;
      default:
        throw new Error('Invalid direction');
    }

    // Wrap coordinates if infinite grid
    if (isInfinite) {
      newX = ((newX % (maxX + 1)) + (maxX + 1)) % (maxX + 1);
      newY = ((newY % (maxY + 1)) + (maxY + 1)) % (maxY + 1);
    }

    return {
      x: newX,
      y: newY
    };
  }
);

export const moveEveryDirection = memoize(
  <T>(tile: TPoint, data: T[][], isDiagonal = true, isInfinite = false) => {
    const directions = [
      ECardinalDirection.North,
      ECardinalDirection.South,
      ECardinalDirection.East,
      ECardinalDirection.West
    ];

    if (isDiagonal) {
      directions.push(
        ECardinalDirection.NorthEast,
        ECardinalDirection.SouthEast,
        ECardinalDirection.SouthWest,
        ECardinalDirection.NorthWest
      );
    }

    return directions.map((direction) => move(tile, data, direction, isInfinite));
  }
);
