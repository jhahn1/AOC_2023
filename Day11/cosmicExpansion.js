import { testInput1, input1 } from './input.js';
import { prettyLog } from '../util.js';

export const cosmicExpansion = async () => {
  const grid = input1.split('\n').map((row) => row.split('').map((c) => c.trim()));
  const columnsToExpand = searchColumns(grid);
  const rowsToExpand = searchRows(grid);
  const [{ columns, galaxies }, rows] = await Promise.all([columnsToExpand, rowsToExpand]);
  const galaxyTargets = [...galaxies];
  let result = 0;
  while (galaxyTargets.length > 0) {
    const { x, y } = galaxyTargets.shift();
    const distance = galaxyTargets.reduce((acc, target) => {
      const distance = Math.abs(target.x - x) + Math.abs(target.y - y);
      const expandedSpace =
        columns.filter((c) => c <= Math.max(x, target.x) && c >= Math.min(x, target.x)).length * 999999 +
        rows.filter((r) => r <= Math.max(y, target.y) && r >= Math.min(y, target.y)).length * 999999;
      const totalDistance = distance + expandedSpace;
      acc += totalDistance;
      return acc;
    }, 0);
    result += distance;
  }
  console.log(`Result: ${result}`);
};

const searchRows = async (grid) => {
  const rows = grid.reduce((acc, row, rowIndex) => {
    if (!row.some((cell) => cell === '#')) {
      acc = [...acc, rowIndex];
    }
    return acc;
  }, []);
  return rows;
};

const searchColumns = async (grid) => {
  const galaxies = [];
  const columns = [];
  grid[0].forEach((_, cellIndex) => {
    const columnByX = grid.map((row, rowIndex) => {
      if (row[cellIndex] === '#') {
        galaxies.push({ x: cellIndex, y: rowIndex });
      }
      return row[cellIndex];
    });
    if (!columnByX.some((cell) => cell === '#')) {
      columns.push(cellIndex);
    }
  });
  return { columns, galaxies };
};
