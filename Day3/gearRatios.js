import { input1 } from './input.js';
import Table from 'cli-table3';
import colors from '@colors/colors';

export const part1 = async (rows) => {
  const columnCount = rows[0].split('').length;
  let table = new Table({
    head: Array.from({ length: columnCount + 1 }, (v, i) => (i === 0 ? '' : colors.white(i - 1))),
    style: { 'padding-left': 0, 'padding-right': 0, head: [] },
  });
  const tableRows = [];
  const symbolIndexPromises = rows.map(async (row, index) => {
    const rowCells = row.split('');
    tableRows.push({ [`${index}`]: rowCells });
    return await getSymbolIndices(rowCells, index);
  });
  const symbolIndices = await Promise.all(symbolIndexPromises);
  symbolIndices.flat().forEach((sindex) => {
    tableRows[sindex.y][sindex.y][sindex.x] = colors.bgBlue(tableRows[sindex.y][sindex.y][sindex.x]);
  });
  const numberLocSet = new Set();
  const siPromises = symbolIndices.flat().map(async (si) => {
    const adjacentNumberIndices = getAdjacentNumberIndices(rows, si);
    adjacentNumberIndices.forEach((ani) => {
      tableRows[ani.y][ani.y][ani.x] = colors.bgBrightCyan(tableRows[ani.y][ani.y][ani.x]);
    });
    adjacentNumberIndices.forEach((ani) => {
      const { start, end } = getNumberBeginEnd(rows, ani);
      for (let i = start.x; i <= end.x; i++) {
        tableRows[start.y][start.y][i] = colors.brightRed(tableRows[start.y][start.y][i]);
      }
      numberLocSet.add(JSON.stringify({ start, end }));
    });
  });
  await Promise.all(siPromises);

  table.push(...tableRows);
  table.push({ ['']: Array.from({ length: columnCount }, (v, i) => colors.white(i)) });
  console.log(table.toString());
  const sum = [...numberLocSet].reduce((acc, loc) => {
    const { start, end } = JSON.parse(loc);
    const fullNumber = rows[start.y].slice(start.x, end.x + 1);
    acc = acc + parseInt(fullNumber);
    return acc;
  }, 0);
  console.log(sum);
};

const part2 = async (rows) => {
  const columnCount = rows[0].split('').length;
  let table = new Table({
    head: Array.from({ length: columnCount + 1 }, (v, i) => (i === 0 ? '' : colors.white(i - 1))),
    style: { 'padding-left': 0, 'padding-right': 0, head: [] },
  });
  const tableRows = [];
  const gearIndexPromises = rows.map(async (row, index) => {
    const rowCells = row.split('');
    tableRows.push({ [`${index}`]: rowCells });
    return await getGearIndices(rowCells, index);
  });
  const gearIndices = await Promise.all(gearIndexPromises);
  gearIndices.flat().forEach((sindex) => {
    tableRows[sindex.y][sindex.y][sindex.x] = colors.bgBlue(tableRows[sindex.y][sindex.y][sindex.x]);
  });
  const gearRatios = [];
  const giPromises = gearIndices.flat().map(async (gi) => {
    const partNumbers = new Set();
    const adjacentNumberIndices = getAdjacentNumberIndices(rows, gi);
    adjacentNumberIndices.forEach((ani) => {
      tableRows[ani.y][ani.y][ani.x] = colors.bgBrightCyan(tableRows[ani.y][ani.y][ani.x]);
    });
    adjacentNumberIndices.forEach((ani) => {
      const { start, end } = getNumberBeginEnd(rows, ani);
      partNumbers.add(JSON.stringify({ start, end }));
    });
    if (partNumbers.size === 2) {
      const ratio = [...partNumbers].reduce((acc, pn) => {
        const { start, end } = JSON.parse(pn);
        for (let i = start.x; i <= end.x; i++) {
          tableRows[start.y][start.y][i] = colors.brightRed(tableRows[start.y][start.y][i]);
        }
        const fullNumber = rows[start.y].slice(start.x, end.x + 1);
        acc = acc * parseInt(fullNumber);
        return acc;
      }, 1);
      gearRatios.push(ratio);
    }
  });
  await Promise.all(giPromises);
  table.push(...tableRows);
  table.push({ ['']: Array.from({ length: columnCount }, (v, i) => colors.white(i)) });
  console.log(table.toString());
  const sum = gearRatios.reduce((acc, gr) => {
    acc = acc + gr;
    return acc;
  }, 0);
  console.log(sum);
};

export const gearRatios = async () => {
  const rows = input1.split('\n');
  part2(rows);
};

const getNumberBeginEnd = (rows, adjacentNumberIndex) => {
  const firstHalf = rows[adjacentNumberIndex.y].slice(0, adjacentNumberIndex.x).split('');
  const lastHalf = rows[adjacentNumberIndex.y].slice(adjacentNumberIndex.x + 1).split('');
  let firstIndex = firstHalf.findLastIndex((first) => isSymbol(first) || first === '.');
  firstIndex = firstIndex === -1 ? 0 : firstIndex + 1;
  let lastIndex = lastHalf.findIndex((last) => isSymbol(last) || last === '.');
  lastIndex = lastIndex === -1 ? rows[adjacentNumberIndex.y].length - 1 : adjacentNumberIndex.x + lastIndex;
  return { start: { y: adjacentNumberIndex.y, x: firstIndex }, end: { y: adjacentNumberIndex.y, x: lastIndex } };
};

const getAdjacentNumberIndices = (rows, symbolIndex) => {
  const { x, y } = symbolIndex;
  const adjacentNumberIndices = [];
  const topLeftIndex = rows[y - 1] && rows[x - 1] ? { x: x - 1, y: y - 1 } : null;
  if (topLeftIndex && !isNaN(rows[topLeftIndex.y][topLeftIndex.x])) {
    adjacentNumberIndices.push(topLeftIndex);
  }
  const topIndex = rows[y - 1] ? { x, y: y - 1 } : null;
  if (topIndex && !isNaN(rows[topIndex.y][topIndex.x])) {
    adjacentNumberIndices.push(topIndex);
  }
  const topRightIndex = rows[y - 1] && rows[x + 1] ? { x: x + 1, y: y - 1 } : null;
  if (topRightIndex && !isNaN(rows[topRightIndex.y][topRightIndex.x])) {
    adjacentNumberIndices.push(topRightIndex);
  }
  const leftIndex = rows[x - 1] ? { x: x - 1, y: y } : null;
  if (leftIndex && !isNaN(rows[leftIndex.y][leftIndex.x])) {
    adjacentNumberIndices.push(leftIndex);
  }
  const rightIndex = rows[x + 1] ? { x: x + 1, y: y } : null;
  if (rightIndex && !isNaN(rows[rightIndex.y][rightIndex.x])) {
    adjacentNumberIndices.push(rightIndex);
  }
  const bottomLeftIndex = rows[y + 1] && rows[x - 1] ? { x: x - 1, y: y + 1 } : null;
  if (bottomLeftIndex && !isNaN(rows[bottomLeftIndex.y][bottomLeftIndex.x])) {
    adjacentNumberIndices.push(bottomLeftIndex);
  }
  const bottomIndex = rows[y + 1] ? { x, y: y + 1 } : null;
  if (bottomIndex && !isNaN(rows[bottomIndex.y][bottomIndex.x])) {
    adjacentNumberIndices.push(bottomIndex);
  }
  const bottomRightIndex = rows[y + 1] && rows[x + 1] ? { x: x + 1, y: y + 1 } : null;
  if (bottomRightIndex && !isNaN(rows[bottomRightIndex.y][bottomRightIndex.x])) {
    adjacentNumberIndices.push(bottomRightIndex);
  }
  return adjacentNumberIndices;
};

const getSymbolIndices = async (row, column, symbolIndices = [], currentIndex = 0) => {
  const symbolIndex = row.findIndex((cell) => isSymbol(cell));
  if (symbolIndex > -1) {
    symbolIndices.push({ x: symbolIndex + currentIndex, y: column });
    const slicedRow = row.slice(symbolIndex + 1);
    return getSymbolIndices(slicedRow, column, symbolIndices.flat(), currentIndex + symbolIndex + 1);
  } else {
    return symbolIndices;
  }
};

const getGearIndices = async (row, column, gearIndices = [], currentIndex = 0) => {
  const gearIndex = row.findIndex((cell) => cell === '*');
  if (gearIndex > -1) {
    gearIndices.push({ x: gearIndex + currentIndex, y: column });
    const slicedRow = row.slice(gearIndex + 1);
    return getSymbolIndices(slicedRow, column, gearIndices.flat(), currentIndex + gearIndex + 1);
  } else {
    return gearIndices;
  }
};

const isSymbol = (char) => char !== '.' && isNaN(char);
