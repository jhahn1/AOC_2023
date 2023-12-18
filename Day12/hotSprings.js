import { testInput1, input1 } from './input.js';
import { prettyLog } from '../util.js';

const cache = new Map();

export const hotSprings = () => {
  const rows = input1.split('\n');
  const records = rows.reduce((acc, row) => {
    const split = row.split(' ');
    acc = [
      ...acc,
      {
        arrangment: Array.from({ length: 5 }, (v, i) => i)
          .map((i) => (i === 4 ? split[0] : split[0] + '?'))
          .join('')
          .split('')
          .filter((s) => !!s),
        brokenCounts: Array.from({ length: 5 }, () => split[1].split(',').map((bc) => parseInt(bc))).flat(),
      },
    ];
    return acc;
  }, []);
  const result = records.reduce((acc, { arrangment, brokenCounts }) => {
    acc += countCombinations(arrangment, brokenCounts);
    return acc;
  }, 0);
  console.log(`RESULT: ${result}`);
};

const countCombinations = (arrangement, brokenCounts) => {
  if (arrangement.length === 0) {
    return brokenCounts.length === 0 ? 1 : 0;
  }
  if (brokenCounts.length === 0) {
    return arrangement.includes('#') ? 0 : 1;
  }

  let cacheKey = `${arrangement.join()}${brokenCounts.join()}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  let count = 0;
  if (['.', '?'].includes(arrangement[0])) {
    count += countCombinations(arrangement.slice(1), brokenCounts);
  }
  if (['#', '?'].includes(arrangement[0])) {
    const arrangementSubSet = arrangement.slice(0, brokenCounts[0]);
    if (
      brokenCounts[0] <= arrangement.length &&
      !arrangementSubSet.includes('.') &&
      (brokenCounts[0] === arrangement.length || arrangement[brokenCounts[0]] !== '#')
    ) {
      count += countCombinations(arrangement.slice(brokenCounts[0] + 1), brokenCounts.slice(1));
    }
  }
  cache.set(cacheKey, count);
  return count;
};
