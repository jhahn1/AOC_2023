import { testInput1, input1 } from './input.js';
import { parseGrid, columnsToRows, rowsToColumns, prettyLog } from '../util.js';
import Table from 'cli-table3';

export const reflectorDish = () => {
  const grid = parseGrid(input1);
  console.log(part1(grid));
  console.log(part2(grid));
};

const part2 = (grid) => {
  const cycleLoads = [];
  const iterations = 300;
  let cycle = [...grid];
  for (let i = iterations; i > 0; i--) {
    cycle = tiltCycle([...cycle]);
    const load = cycle.reduce((acc, row, index) => {
      const rockCount = row.filter((cell) => cell === 'O').length;
      acc += rockCount * (cycle.length - index);
      return acc;
    }, 0);
    cycleLoads.push(load);
  }
  const { start, pattern } = detectPattern(cycleLoads);
  const resultIndex = (1e9 - start) % pattern.length;
  return pattern[resultIndex - 1];
};

const detectPattern = (loads) => {
  for (let i = 0; i < loads.length - 1; i++) {
    let searchPattern = '';
    let remainingLoads = [...[...loads].slice(i).map((l) => `${l}`)];
    while (remainingLoads.length >= searchPattern.split('#').length) {
      searchPattern += `${remainingLoads.shift()}#`;
      const remainingLoadsStr = remainingLoads.join('#');
      if (remainingLoadsStr.includes(searchPattern)) {
        const pattern = searchPattern.split('#').filter((s) => !!s);
        if (
          pattern.some((load) => load !== pattern[0]) &&
          pattern.every((load, index) => remainingLoads[index] === load)
        ) {
          return { start: i, pattern };
        }
      } else {
        break;
      }
    }
  }
};

const tiltCycle = (grid) => {
  const tiltNorth = rowsToColumns(tilt(columnsToRows(grid)));
  const tiltWest = tilt(tiltNorth);
  const tiltSouth = rowsToColumns(tilt(columnsToRows(tiltWest), 'O'));
  return tilt(tiltSouth, 'O');
};

const tilt = (grid, followsCube = '.') =>
  grid.reduce((acc, row) => {
    let sortedRow = row;
    if (row.includes('O')) {
      const cubeIndices = findCubes(row).sort((a, b) => a - b);
      sortedRow = [...cubeIndices, row.length].reduce((rowAcc, ci, index) => {
        const toSort = rowAcc.length > 0 ? row.slice(rowAcc.length, ci) : row.slice(0, ci);
        toSort.forEach((cell) => {
          rowAcc =
            cell === followsCube
              ? rowAcc.toSpliced(rowAcc.length, 0, cell)
              : rowAcc.toSpliced(cubeIndices[index - 1] + 1, 0, cell);
        });
        return rowAcc;
      }, []);
    }
    acc = [...acc, sortedRow];
    return acc;
  }, []);

const findCubes = (row, indices = []) => {
  if (row.length === 0) {
    return indices;
  }
  const cellsToCheck = indices.length > 0 ? row.slice(indices[indices.length - 1] + 1) : row;
  const cubeIndex = cellsToCheck.findIndex((cell) => cell === '#');
  return cubeIndex === -1 ? indices : findCubes(row, [...indices, cubeIndex + (row.length - cellsToCheck.length)]);
};

const part1 = (grid) =>
  columnsToRows(grid)
    .map((row) =>
      row.reduce(
        (acc, cell, index) => {
          if (cell === 'O') {
            acc.sum += acc.load;
            acc.load -= 1;
          } else if (cell === '#') {
            acc.load = row.length - index - 1;
          }
          return acc;
        },
        { sum: 0, load: row.length },
      ),
    )
    .reduce((acc, data) => {
      acc += data.sum;
      return acc;
    }, 0);
