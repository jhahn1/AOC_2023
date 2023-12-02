import { testInput1, input1 } from './input.js';

const colorMap = {
  red: 12,
  green: 13,
  blue: 14,
};

export const cubeConundrum = () => {
  const rows = input1.split('\n');
  const result = part2(rows);
  console.log(result);
};

const part1 = (rows) =>
  rows.reduce((acc, row) => {
    const [game, colors] = row.split(':');
    const gameNumber = game.split(' ')[1];
    let possible = true;
    colors.split(';').forEach((subset) => {
      const countColors = subset.trim().split(',');
      countColors.forEach((countColor) => {
        const [count, color] = countColor.trim().split(' ');
        if (count > colorMap[color]) {
          possible = false;
        }
      });
    });
    if (possible) {
      acc += parseInt(gameNumber);
    }
    return acc;
  }, 0);

const part2 = (rows) => {
  const result = rows.reduce((acc, row) => {
    const colorCounts = {};
    const [, colors] = row.split(':');
    colors.split(';').forEach((subset) => {
      const countColors = subset.trim().split(',');
      countColors.forEach((countColor) => {
        const [count, color] = countColor.trim().split(' ');
        colorCounts[color] =
          !colorCounts[color] || colorCounts[color] < parseInt(count) ? parseInt(count) : colorCounts[color];
      });
    });
    const power = Object.values(colorCounts).reduce((acc, count) => {
      acc = acc * count;
      return acc;
    });
    acc = acc + power;
    return acc;
  }, 0);
  return result;
};
