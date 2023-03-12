import crypto from "crypto";

/**
 * Checks whether the grid passed as parameter is full or not
 * @param grid main game grid
 */
export function isFull(grid: string[][]): boolean {
  for (let row of grid) for (let col of row) if (!col) return false;
  return true;
}

/**
 * Returns existing winner for this grid and return empty string if we have a draw
 * @param grid main game grid
 */
export function getWinner(grid: string[][]): string {
  // Checking rows
  for (let row of grid) {
    if (row[0] === row[1] && row[1] === row[2]) return row[0];
  }

  // Checking columns
  for (let i = 0; i < 3; ++i) {
    if (grid[0][i] === grid[1][i] && grid[1][i] === grid[2][i])
      return grid[0][i];
  }

  // Checking diagonals
  if (grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) return grid[1][1];
  if (grid[2][0] === grid[1][1] && grid[1][1] === grid[0][2]) return grid[1][1];

  return "";
}

// Returns number of non-empty cells
export function getMovesCount(grid: string[][]): number {
  let count = 0;
  for (let row of grid) for (let col of row) if (col) count++;
  return count;
}

// Generate random room name
export function getRandomRoom(): string {
  return crypto.randomBytes(10).toString("hex");
}
