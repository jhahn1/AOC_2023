import { testInput, input, testInput2 } from './input.js';

export const trebuchet = async () => {
  const inputLines = input.split('\n');
  const result = part2(inputLines);
  console.log(result);
};

const part1 = (inputLines) =>
  inputLines.reduce((acc, line) => {
    const { firstInt, lastInt } = firstLastInt(line);
    acc = acc += parseInt(`${firstInt}${lastInt}`);
    return acc;
  }, 0);

const part2 = (inputLines) => {
  const final = inputLines.reduce((acc, line) => {
    const result = [];
    const { firstInt, lastInt } = firstLastInt(line);
    result.push({ intVal: firstInt, index: line.indexOf(firstInt) });
    result.push({ intVal: lastInt, index: line.lastIndexOf(lastInt) });
    const { first, last } = firstLastWord(line);
    result.push(first);
    result.push(last);
    const sorted = result.filter((r) => r.index !== -1 && !!r.intVal).sort((a, b) => a.index - b.index);
    acc += parseInt(`${sorted[0].intVal}${sorted[sorted.length - 1].intVal}`);
    return acc;
  }, 0);
  return final;
};

const firstLastWord = (i) => {
  const wordIntMap = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };
  let firstWordIndex = Infinity;
  let firstWordIntVal = null;
  let lastWordIndex = 0;
  let lastWordIntVal = null;
  Object.entries(wordIntMap).forEach(([word, intVal]) => {
    const firstIndex = i.indexOf(word);
    const lastIndex = i.lastIndexOf(word);
    if (firstIndex > -1 && firstIndex < firstWordIndex) {
      firstWordIndex = firstIndex;
      firstWordIntVal = intVal;
    }
    if (lastIndex > -1 && lastIndex > lastWordIndex) {
      lastWordIndex = lastIndex;
      lastWordIntVal = intVal;
    }
  });
  return {
    first: { intVal: firstWordIntVal, index: firstWordIndex },
    last: { intVal: lastWordIntVal, index: lastWordIndex },
  };
};
const firstLastInt = (i) => {
  const chars = i.split('');
  const firstInt = chars.find((char) => parseInt(char));
  const lastInt = chars.findLast((char) => parseInt(char));
  return { firstInt, lastInt };
};
