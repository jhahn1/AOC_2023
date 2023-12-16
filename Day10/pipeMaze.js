import {
  testInput1,
  testInput1b,
  testInput1c,
  input1,
  testInput2,
  testInput2b,
  testInput2c,
  testInput2d,
  testInput2e,
} from './input.js';
import { prettyLog } from '../util.js';
import Table from 'cli-table3';
import colors from '@colors/colors';

const Arrows = {
  UP: '↑',
  DOWN: '↓',
  RIGHT: '→',
  LEFT: '←',
};

const relativeCell = new Map([
  ['TOP', ({ x, y }) => ({ x, y: y - 1 })],
  ['BOTTOM', ({ x, y }) => ({ x, y: y + 1 })],
  ['RIGHT', ({ x, y }) => ({ x: x + 1, y })],
  ['LEFT', ({ x, y }) => ({ x: x - 1, y })],
  ['TOPLEFT', ({ x, y }) => ({ x: x - 1, y: y - 1 })],
  ['TOPRIGHT', ({ x, y }) => ({ x: x + 1, y: y - 1 })],
  ['BOTTOMLEFT', ({ x, y }) => ({ x: x - 1, y: y + 1 })],
  ['BOTTOMRIGHT', ({ x, y }) => ({ x: x + 1, y: y + 1 })],
]);

const borderMap = new Map([
  [
    Arrows.DOWN,
    (pos, prevArrow) => ({
      front: [
        { cell: relativeCell.get('BOTTOMLEFT')(pos), position: 'left' },
        { cell: relativeCell.get('BOTTOMRIGHT')(pos), position: 'right' },
        { cell: relativeCell.get('BOTTOM')(relativeCell.get('BOTTOMLEFT')(pos)), position: 'leftColor' },
        { cell: relativeCell.get('BOTTOM')(relativeCell.get('BOTTOMRIGHT')(pos)), position: 'rightColor' },
      ],
      middle:
        prevArrow === Arrows.DOWN
          ? [
              { cell: relativeCell.get('RIGHT')(pos), position: 'right' },
              { cell: relativeCell.get('LEFT')(pos), position: 'left' },
            ]
          : prevArrow === Arrows.RIGHT
          ? [{ cell: relativeCell.get('RIGHT')(pos), position: 'right' }]
          : [{ cell: relativeCell.get('LEFT')(pos), position: 'left' }],
      back: [Arrows.RIGHT, Arrows.LEFT].includes(prevArrow)
        ? [
            { cell: relativeCell.get('TOPLEFT')(pos), position: prevArrow === Arrows.LEFT ? 'left' : 'right' },
            { cell: relativeCell.get('TOP')(pos), position: prevArrow === Arrows.LEFT ? 'left' : 'right' },
            { cell: relativeCell.get('TOPRIGHT')(pos), position: prevArrow === Arrows.LEFT ? 'left' : 'right' },
          ]
        : [
            { cell: relativeCell.get('TOPLEFT')(pos), position: 'left' },
            { cell: relativeCell.get('TOPRIGHT')(pos), position: 'right' },
          ],
    }),
  ],
  [
    Arrows.UP,
    (pos, prevArrow) => {
      return {
        front: [
          { cell: relativeCell.get('TOPLEFT')(pos), position: 'right' },
          { cell: relativeCell.get('TOPRIGHT')(pos), position: 'left' },
          { cell: relativeCell.get('TOP')(relativeCell.get('TOPLEFT')(pos)), position: 'rightColor' },
          { cell: relativeCell.get('TOP')(relativeCell.get('TOPRIGHT')(pos)), position: 'leftColor' },
        ],
        middle:
          prevArrow === Arrows.UP
            ? [
                { cell: relativeCell.get('RIGHT')(pos), position: 'left' },
                { cell: relativeCell.get('LEFT')(pos), position: 'right' },
              ]
            : prevArrow === Arrows.RIGHT
            ? [{ cell: relativeCell.get('RIGHT')(pos), position: 'left' }]
            : [{ cell: relativeCell.get('LEFT')(pos), position: 'right' }],
        back: [Arrows.RIGHT, Arrows.LEFT].includes(prevArrow)
          ? [
              { cell: relativeCell.get('BOTTOMLEFT')(pos), position: prevArrow === Arrows.LEFT ? 'right' : 'left' },
              { cell: relativeCell.get('BOTTOM')(pos), position: prevArrow === Arrows.LEFT ? 'right' : 'left' },
              { cell: relativeCell.get('BOTTOMRIGHT')(pos), position: prevArrow === Arrows.LEFT ? 'right' : 'left' },
            ]
          : [
              { cell: relativeCell.get('BOTTOMLEFT')(pos), position: 'right' },
              { cell: relativeCell.get('BOTTOMRIGHT')(pos), position: 'left' },
            ],
      };
    },
  ],
  [
    Arrows.RIGHT,
    (pos, prevArrow) => ({
      front: [
        { cell: relativeCell.get('RIGHT')(relativeCell.get('TOPRIGHT')(pos)), position: 'rightColor' },
        { cell: relativeCell.get('RIGHT')(relativeCell.get('BOTTOMRIGHT')(pos)), position: 'leftColor' },
        { cell: relativeCell.get('TOPRIGHT')(pos), position: 'right' },
        { cell: relativeCell.get('BOTTOMRIGHT')(pos), position: 'left' },
      ],
      middle:
        prevArrow === Arrows.RIGHT
          ? [
              { cell: relativeCell.get('TOP')(pos), position: 'right' },
              { cell: relativeCell.get('BOTTOM')(pos), position: 'left' },
            ]
          : prevArrow === Arrows.UP
          ? [{ cell: relativeCell.get('TOP')(pos), position: prevArrow === Arrows.DOWN ? 'left' : 'right' }]
          : [{ cell: relativeCell.get('BOTTOM')(pos), position: prevArrow === Arrows.DOWN ? 'left' : 'right' }],
      back: [Arrows.UP, Arrows.DOWN].includes(prevArrow)
        ? [
            { cell: relativeCell.get('TOPLEFT')(pos), position: prevArrow === Arrows.DOWN ? 'left' : 'right' },
            { cell: relativeCell.get('LEFT')(pos), position: prevArrow === Arrows.DOWN ? 'left' : 'right' },
            { cell: relativeCell.get('BOTTOMLEFT')(pos), position: prevArrow === Arrows.DOWN ? 'left' : 'right' },
          ]
        : [
            { cell: relativeCell.get('TOPLEFT')(pos), position: 'right' },
            { cell: relativeCell.get('BOTTOMLEFT')(pos), position: 'left' },
          ],
    }),
  ],
  [
    Arrows.LEFT,
    (pos, prevArrow) => ({
      front: [
        { cell: relativeCell.get('LEFT')(relativeCell.get('TOPLEFT')(pos)), position: 'leftColor' },
        { cell: relativeCell.get('LEFT')(relativeCell.get('BOTTOMLEFT')(pos)), position: 'rightColor' },
        { cell: relativeCell.get('TOPLEFT')(pos), position: 'left' },
        { cell: relativeCell.get('BOTTOMLEFT')(pos), position: 'right' },
      ],
      middle:
        prevArrow === Arrows.LEFT
          ? [
              { cell: relativeCell.get('TOP')(pos), position: 'left' },
              { cell: relativeCell.get('BOTTOM')(pos), position: 'right' },
            ]
          : prevArrow === Arrows.UP
          ? [{ cell: relativeCell.get('TOP')(pos), position: 'left' }]
          : [{ cell: relativeCell.get('BOTTOM')(pos), position: 'right' }],
      back: [Arrows.UP, Arrows.DOWN].includes(prevArrow)
        ? [
            { cell: relativeCell.get('TOPRIGHT')(pos), position: prevArrow === Arrows.UP ? 'left' : 'right' },
            { cell: relativeCell.get('RIGHT')(pos), position: prevArrow === Arrows.UP ? 'left' : 'right' },
            { cell: relativeCell.get('BOTTOMRIGHT')(pos), position: prevArrow === Arrows.UP ? 'left' : 'right' },
          ]
        : [
            { cell: relativeCell.get('TOPRIGHT')(pos), position: 'left' },
            { cell: relativeCell.get('BOTTOMRIGHT')(pos), position: 'right' },
          ],
    }),
  ],
]);

const navigationMap = new Map([
  [
    '|',
    (currPipe, newPipe) =>
      currPipe.y > newPipe.y
        ? { nextPath: relativeCell.get('TOP')(newPipe), newSymbol: Arrows.UP }
        : { nextPath: relativeCell.get('BOTTOM')(newPipe), newSymbol: Arrows.DOWN },
  ],
  [
    '-',
    (currPipe, newPipe) =>
      currPipe.x > newPipe.x
        ? { nextPath: relativeCell.get('LEFT')(newPipe), newSymbol: Arrows.LEFT }
        : { nextPath: relativeCell.get('RIGHT')(newPipe), newSymbol: Arrows.RIGHT },
  ],
  [
    'L',
    (currPipe, newPipe) =>
      currPipe.x > newPipe.x
        ? { nextPath: relativeCell.get('TOP')(newPipe), newSymbol: Arrows.UP }
        : { nextPath: relativeCell.get('RIGHT')(newPipe), newSymbol: Arrows.RIGHT },

    ,
  ],
  [
    'J',
    (currPipe, newPipe) =>
      currPipe.x < newPipe.x
        ? { nextPath: relativeCell.get('TOP')(newPipe), newSymbol: Arrows.UP }
        : { nextPath: relativeCell.get('LEFT')(newPipe), newSymbol: Arrows.LEFT },
  ],
  [
    '7',
    (currPipe, newPipe) =>
      currPipe.x < newPipe.x
        ? { nextPath: relativeCell.get('BOTTOM')(newPipe), newSymbol: Arrows.DOWN }
        : { nextPath: relativeCell.get('LEFT')(newPipe), newSymbol: Arrows.LEFT },
  ],
  [
    'F',
    (currPipe, newPipe) =>
      currPipe.x > newPipe.x
        ? { nextPath: relativeCell.get('BOTTOM')(newPipe), newSymbol: Arrows.DOWN }
        : { nextPath: relativeCell.get('RIGHT')(newPipe), newSymbol: Arrows.RIGHT },
  ],
]);

export const pipeMaze = async () => {
  const rows = input1.split('\n');
  const columnCount = rows[0].split('').length;
  let start;
  const tableGrid = [];
  const grid = rows.map((row, index) => {
    const cells = row.split('');
    tableGrid.push({ [`${index}`]: [...cells] });
    if (cells.includes('S')) start = { y: index, x: cells.indexOf('S') };
    return cells;
  });
  const startingPipes = getStartPipes(grid, start);
  part2(start, startingPipes, grid, columnCount, tableGrid);
};
const shoelaceFormula = (pipes) => {
  let area = 0;
  for (let i = 0; i < pipes.length; i++) {
    const nextIndex = (i + 1) % pipes.length;
    const { x: currX, y: currY } = pipes[i];
    const { x: nextX, y: nextY } = pipes[nextIndex];
    area += currX * nextY - currY * nextX;
  }
  area = Math.abs(area) / 2;
  return area;
};

const part2 = async (start, startingPipes, grid, columnCount, tableGrid) => {
  let loopCoordinates = mainLoopRoute([...[start, startingPipes[0]]], grid, columnCount, [...tableGrid]);
  loopCoordinates.set(JSON.stringify({ x: start.x, y: start.y }), 1);
  const pipesArray = [...loopCoordinates.keys()].map((lc) => JSON.parse(lc));
  //Finally looked up a hint lolol
  const area = shoelaceFormula(pipesArray);
  const result = area - loopCoordinates.size / 2 + 1;
  console.log(`Result: ${result}`);

  // Possibly could've worked but getting stack overflow since the actual input size is so large.
  // const largerColumnCount = columnCount * 3;
  // const blankRow = [...Array.from({ length: largerColumnCount }, () => ' ')];
  // console.log(JSON.stringify(grid));
  // [...loopCoordinates.keys()].forEach((key) => {
  //   const { x, y } = JSON.parse(key);
  //   grid[y][x] = tableGrid[y][y][x];
  // });
  // const largeGrid = grid.reduce((acc, row) => {
  //   const paddedRow = row.map((cell) => [' ', cell, ' ']).flat();
  //   acc = [...acc, [...blankRow], paddedRow, [...blankRow]];
  //   return acc;
  // }, []);
  // console.log(JSON.stringify(largeGrid));
  // const pipeSymbols = Object.values(Arrows);
  // let firstSymbol;
  // let i = 0;
  // while (!firstSymbol) {
  //   const firstSymbolIndex = largeGrid[i].findIndex((cell) => pipeSymbols.includes(cell));
  //   if (firstSymbolIndex !== -1) {
  //     firstSymbol = { x: firstSymbolIndex, y: i };
  //     break;
  //   } else {
  //     i += 1;
  //   }
  // }
  // console.log(`firstSymbol: ${prettyLog(firstSymbol)}`);

  // let table = new Table({
  //   head: [],
  //   style: { 'padding-left': 0, 'padding-right': 0, head: [] },
  // });
  // const largeTableGrid = [];
  // largeGrid.forEach((row) => {
  //   largeTableGrid.push([...row]);
  // });
  // const [gridWithBorders, masterGrid] = colorBorders(largeTableGrid, firstSymbol, firstSymbol, largeGrid);
  // // gridWithBorders.forEach((row) => table.push(...[row]));
  // // console.log(table.toString());
  // let outsideSymbol;
  // let osIter = 0;
  // while (!outsideSymbol) {
  //   const symbol = masterGrid[osIter].find((cell) => ['##', '**'].includes(cell));
  //   if (symbol !== -1) {
  //     outsideSymbol = symbol;
  //     break;
  //   } else {
  //     osIter += 1;
  //   }
  // }
  // const insideSymbol = outsideSymbol === '##' ? '**' : '##';
  // const insideCellCount = masterGrid.reduce((acc, row, index) => {
  //   const insideCells = countInsideCells(row, insideSymbol);
  //   acc = acc + insideCells;
  //   return acc;
  // }, 0);
};

const countInsideCells = (row, insideSymbol, insideCount = 0) => {
  const leftInsideWall = row.indexOf(insideSymbol);

  if (leftInsideWall !== -1) {
    const firstSlice = row.slice(leftInsideWall + 1);
    const rightInsideWall = firstSlice.indexOf(insideSymbol);
    if (rightInsideWall !== -1) {
      const lastSlice = row.slice(leftInsideWall + 1, rightInsideWall + leftInsideWall + 1);
      lastSlice.forEach((cell) => {
        if (![' ', '', '##', '**'].includes(cell)) {
          insideCount += 1;
        }
      });
      const remainingRow = row.slice(rightInsideWall + leftInsideWall + 2);
      if (remainingRow.length > 0) {
        return countInsideCells(remainingRow, insideSymbol, insideCount);
      } else {
        return insideCount;
      }
    }
  }
  return insideCount;
};

const colorBorders = (
  tableGrid,
  currentPos,
  firstPos,
  masterGrid,
  rightColorCell,
  leftColorCell,
  prevSymbol,
  symbolsProcessed = 0,
) => {
  const symbolArrow = tableGrid[currentPos.y][currentPos.x];
  let rightBorder = rightColorCell ? masterGrid[rightColorCell.y][rightColorCell.x] : '##';
  let leftBorder = leftColorCell ? masterGrid[leftColorCell.y][leftColorCell.x] : '**';
  const borderData = borderMap.get(symbolArrow)(
    {
      x: currentPos.x,
      y: currentPos.y,
    },
    prevSymbol,
  );
  const borders = prevSymbol ? [...borderData.front, ...borderData.middle, ...borderData.back] : [...borderData.front];

  borders.forEach(({ cell, position }) => {
    const newCell = ['right', 'rightColor'].includes(position) ? rightBorder : leftBorder;
    tableGrid[cell.y][cell.x] = newCell;
    masterGrid[cell.y][cell.x] = newCell;
  });
  if (symbolsProcessed === 2720) {
    console.log(JSON.stringify(masterGrid));
    // return [tableGrid, masterGrid];
  }
  if (prevSymbol && firstPos.x === currentPos.x && firstPos.y === currentPos.y) {
    return [tableGrid, masterGrid];
  }
  Object.values(borderData.front).forEach((sb) => {
    if (sb.position === 'rightColor') {
      rightBorder = sb.cell;
    } else if (sb.position === 'leftColor') {
      leftBorder = sb.cell;
    }
  });
  const nextPos =
    Arrows.UP === symbolArrow
      ? { x: currentPos.x, y: currentPos.y - 3 }
      : Arrows.DOWN === symbolArrow
      ? { x: currentPos.x, y: currentPos.y + 3 }
      : Arrows.RIGHT === symbolArrow
      ? { x: currentPos.x + 3, y: currentPos.y }
      : { x: currentPos.x - 3, y: currentPos.y };
  symbolsProcessed += 1;
  console.log(`SYMBOL COUNT: ${symbolsProcessed}`);
  return colorBorders(tableGrid, nextPos, firstPos, masterGrid, rightBorder, leftBorder, symbolArrow, symbolsProcessed);
};

const part1 = async (start, startingPipes, grid, columnCount, tableGrid) => {
  const mainLoopPromises = startingPipes.map(async (firstPipe) =>
    mainLoopRoute([...[start, firstPipe]], [...grid], columnCount, [...tableGrid]),
  );
  const [stepMap1, stepMap2] = await Promise.all(mainLoopPromises);
  const minStepsArray = [];
  stepMap1.forEach((value, key) => {
    const altKeyValue = stepMap2.get(key);
    minStepsArray.push(altKeyValue < value ? altKeyValue : value);
  });
  const result = minStepsArray.sort((a, b) => b - a)[0];
  console.log(`result: ${result}`);
};

const getStartPipes = (grid, start) => {
  const result = [];

  const top = { x: start.x, y: start.y - 1 };
  const isTop = top.y >= 0 && ['7', 'F', '|'].includes(grid[top.y][top.x]);
  if (isTop) {
    result.push(top);
  }
  const bottom = { x: start.x, y: start.y + 1 };
  const isBottom = bottom.y <= grid.length && ['J', 'L', '|'].includes(grid[bottom.y][bottom.x]);
  if (isBottom) {
    result.push(bottom);
  }

  const right = { x: start.x + 1, y: start.y };
  const isRight = right.x <= grid[0].length && ['J', '7', '-'].includes(grid[right.y][right.x]);
  if (isRight) {
    result.push(right);
  }
  const left = { x: start.x - 1, y: start.y };
  const isLeft = left.x >= 0 && ['F', 'L', '-'].includes(grid[left.y][left.x]);
  if (isLeft) {
    result.push(left);
  }
  let startSymbol;
  if (isTop && isLeft) {
    startSymbol = 'J';
  } else if (isTop && isRight) {
    startSymbol = 'L';
  } else if (isRight && isLeft) {
    startSymbol = '-';
  } else if (isTop && isBottom) {
    startSymbol = '|';
  } else if (isBottom && isLeft) {
    startSymbol = '7';
  } else if (isBottom && isRight) {
    startSymbol = 'F';
  } else {
    console.error('Cannot find start symbol!!!', prettyLog(start));
  }
  grid[start.y][start.x] = startSymbol;
  return result;
};

const mainLoopRoute = (mainloop, grid, columnCount, tableGrid) => {
  const newTableGrid = [...tableGrid];
  const stepMap = new Map();
  let completedLoop = false;
  while (!completedLoop) {
    const currentPipe = mainloop[mainloop.length - 1];
    const lastPipe = mainloop[mainloop.length - 2];
    const symbol = grid[currentPipe.y][currentPipe.x];
    const { nextPath, newSymbol } = navigationMap.get(symbol)(lastPipe, currentPipe);
    if (currentPipe.x === mainloop[0].x && currentPipe.y === mainloop[0].y) {
      newTableGrid[currentPipe.y][currentPipe.y][currentPipe.x] = newSymbol;
      grid[currentPipe.y][currentPipe.x] = newSymbol;
      completedLoop = true;
      break;
    }
    stepMap.set(`${JSON.stringify(currentPipe)}`, mainloop.length - 1);
    newTableGrid[currentPipe.y][currentPipe.y][currentPipe.x] = newSymbol;
    grid[currentPipe.y][currentPipe.x] = newSymbol;
    mainloop.push(nextPath);
  }
  let table = new Table({
    head: Array.from({ length: columnCount + 1 }, (v, i) => (i === 0 ? '' : colors.white(i - 1))),
    style: { 'padding-left': 0, 'padding-right': 0, head: [] },
  });
  table.push(...newTableGrid);
  console.log(table.toString());
  return stepMap;
};
