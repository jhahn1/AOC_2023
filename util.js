export const prettyLog = (s) => JSON.stringify(s, null, 2);

export const parseGrid = (i) => i.split('\n').map((row) => row.trim().split(''));

export const columnsToRows = (grid) => [
  ...Array.from({ length: grid[0].length }, (_, i) => grid[0].length - 1 - i).map((i) => grid.map((row) => row[i])),
];

export const rowsToColumns = (grid) => [
  ...Array.from({ length: grid.length }, (_, i) => i).map((i) =>
    [...grid].reverse().map((column) => {
      return column[i];
    }),
  ),
];
