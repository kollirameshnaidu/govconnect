const FINDER = 7;

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function inFinder(row: number, col: number, size: number) {
  const inTopLeft = row < FINDER && col < FINDER;
  const inTopRight = row < FINDER && col >= size - FINDER;
  const inBottomLeft = row >= size - FINDER && col < FINDER;
  return inTopLeft || inTopRight || inBottomLeft;
}

function finderCell(localRow: number, localCol: number) {
  const outer = localRow === 0 || localRow === 6 || localCol === 0 || localCol === 6;
  const inner = localRow >= 2 && localRow <= 4 && localCol >= 2 && localCol <= 4;
  return outer || inner;
}

export function buildVisitToken(value: string, size = 25): boolean[][] {
  const seed = hashString(value.toUpperCase());
  const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => false));

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (inFinder(row, col, size)) continue;
      const bit = (seed >> ((row * size + col) % 31)) & 1;
      const mix = (value.charCodeAt((row + col) % value.length) + row * 3 + col * 7) & 1;
      grid[row][col] = Boolean(bit ^ mix);
    }
  }

  const corners: Array<[number, number]> = [
    [0, 0],
    [0, size - FINDER],
    [size - FINDER, 0],
  ];
  for (const [originRow, originCol] of corners) {
    for (let row = 0; row < FINDER; row += 1) {
      for (let col = 0; col < FINDER; col += 1) {
        grid[originRow + row][originCol + col] = finderCell(row, col);
      }
    }
  }

  for (let index = FINDER; index < size - FINDER; index += 1) {
    grid[6][index] = index % 2 === 0;
    grid[index][6] = index % 2 === 0;
  }

  return grid;
}
