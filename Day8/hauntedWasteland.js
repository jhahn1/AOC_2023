import { input, testInput1, testInput1b, testInput2 } from './input.js';
import { prettyLog } from '../util.js';

export const hauntedWasteland = () => {
  const map = input
    .split('\n')
    .filter((r) => !!r)
    .reduce((acc, row, index) => {
      if (index === 0) {
        acc.instructions = row.split('');
      } else {
        const [node, instructions] = row.split('=').map((r) => r.trim());
        const [left, right] = instructions
          .split(',')
          .map((i) => i.trim().replace('(', ''))
          .map((i) => i.replace(')', ''));
        acc[node] = { L: left, R: right };
      }
      return acc;
    }, {});
  const steps = part2(map);
  //   console.log(`Answer: ${steps}`);
};

const lcm = (...arr) => {
  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  const _lcm = (x, y) => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
};
const part2 = async (map) => {
  const nodes = Object.keys(map).filter((node) => node.split('')[node.length - 1] === 'A');
  const findZPromises = nodes.map(async (node) => await findZ(node, map));
  const findZResults = await Promise.all(findZPromises);
  console.log(`lcm: ${lcm(...findZResults)}`);
};

const findZ = async (node, map) => {
  let step = 0;
  let iterator = 0;
  let foundZ = 0;
  let currentNode = node;
  while (!foundZ) {
    step += 1;
    const direction = map.instructions[iterator];
    currentNode = map[currentNode][direction];
    if (currentNode.split('')[node.length - 1] === 'Z') {
      foundZ = true;
      break;
    } else {
      iterator = iterator === map.instructions.length - 1 ? 0 : iterator + 1;
    }
  }
  return step;
};

const part1 = (map) => {
  let steps = 0;
  let iterator = 0;
  let foundZ = false;
  let currentNode = 'AAA';
  while (!foundZ) {
    steps += 1;
    const direction = map.instructions[iterator];
    currentNode = map[currentNode][direction];
    if (currentNode === 'ZZZ') {
      foundZ = true;
      break;
    } else {
      iterator = iterator === map.instructions.length - 1 ? 0 : iterator + 1;
    }
  }
  return steps;
};
