import { getMovesCount, getWinner, isFull } from "./utils";

// Return an heuristic estimation
function estimate(t: number[]): number {
  if (t[0] === 1) return 30 * t[1];
  if (t[0] === 2) return 50 * t[1];
  return 0;
}

// Attribute score to current grid disposition
function evaluate(grid: string[][]): number {
  let t = [0, 0];
  let score = 0;

  const winner = getWinner(grid);
  if (isFull(grid) || winner) {
    if (winner === "x") return 1000 - getMovesCount(grid);
    else if (winner === "o") return -1000 + getMovesCount(grid);
    else return 0;
  }

  for (let i = 0; i < 3; ++i) {
    if (grid[i][i]) {
      t[0]++;
      if (grid[i][i] === "x") t[1]++;
      else t[1]--;
    }
  }
  score += estimate(t);

  t = [0, 0];
  for (let i = 0; i < 3; ++i) {
    if (grid[i][2 - i]) {
      t[0]++;
      if (grid[i][2 - i] === "x") t[1]++;
      else t[1]--;
    }
  }
  score += estimate(t);

  for (let i = 0; i < 3; ++i) {
    const t = [0, 0];
    for (let j = 0; j < 3; ++j) {
      if (grid[j][i]) {
        t[0]++;
        if (grid[j][i] === "x") t[1]++;
        else t[1]--;
      }
    }
    score += estimate(t);
  }

  for (const row of grid) {
    const t = [0, 0];
    for (const col of row) {
      if (col) {
        t[0]++;
        if (col === "x") t[1]++;
        else t[1]--;
      }
    }
    score += estimate(t);
  }

  return score;
}

// Return optimal cell to place pawn for X
export function getOptimalMove(grid: string[][]): number[] {
  let [tmp, maxI, maxJ] = [0, -1, -1];
  let MAX = -Infinity;

  if (!isFull(grid) && !getWinner(grid)) {
    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        if (!grid[i][j]) {
          grid[i][j] = "x";
          tmp = evaluate(grid);
          if (tmp > MAX) {
            MAX = tmp;
            maxI = i;
            maxJ = j;
          }
          grid[i][j] = "";
        }
      }
    }
  }

  return [maxI, maxJ];
}
