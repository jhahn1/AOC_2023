import { testInput1, input } from './input.js';

const stringToCleanNumArray = (st) =>
  st
    .split(':')[1]
    .split(' ')
    .filter((t) => !!t)
    .map((t) => parseInt(t.replace(' ', '')));

export const waitForIt = () => {
  const inputRows = input.split('\n');
  part2(inputRows);
};

const part2 = (inputRows) => {
  let time = parseInt(stringToCleanNumArray(inputRows[0]).join(''));
  let distance = parseInt(stringToCleanNumArray(inputRows[1]).join(''));
  const race = { time, distance };
  const result = findWaysToWin([race]);
  console.log(`RESULT: ${JSON.stringify(result)}`);
};

const findWaysToWin = (races) =>
  races.reduce((acc, race, index) => {
    Array.from({ length: race.time + 1 }, (v, i) => i).forEach((holdButtonTime) => {
      const distance = getTimeDistance(holdButtonTime, race.time);
      if (distance > race.distance) {
        acc[index] = acc[index]
          ? { ...acc[index], waysToWin: acc[index].waysToWin + 1 }
          : { race: index, waysToWin: 1 };
      }
    });
    return acc;
  }, {});

const part1 = (inputRows) => {
  let times = stringToCleanNumArray(inputRows[0]);
  let distances = stringToCleanNumArray(inputRows[1]);
  const races = Array.from({ length: times.length })
    .fill('x')
    .map((_, i) => {
      return { time: times[i], distance: distances[i] };
    });
  const waysToWinResult = findWaysToWin(races);
  const result = Object.values(waysToWinResult).reduce((acc, res) => {
    acc = acc * res.waysToWin;
    return acc;
  }, 1);
  console.log(result);
};

const getTimeDistance = (holdButtonTime, maxTime) => (maxTime - holdButtonTime) * holdButtonTime;
