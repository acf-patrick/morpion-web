export function isFull(grid: string[][]) {
  for (let row of grid) for (let col of row) if (!col) return false;
  return true;
}

export function getWinner(grid: string[][]) {
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
