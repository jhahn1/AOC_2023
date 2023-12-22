import { testInput1, testInput1b, testInput1c, testInput1d, input1 } from './input.js';
import { prettyLog } from '../util.js';

export const pointOfIncidence = () => {
  const patterns = input1
    .split('\n\n')
    .map((pattern) => pattern.split('\n').map((row) => row.split('')))
    .map((pattern) => ({
      columns: [...pattern],
      rows: [
        ...Array.from({ length: pattern[0].length }, (_, i) => pattern[0].length - 1 - i).map((i) =>
          pattern.map((row) => row[i]),
        ),
      ],
    }));
  console.log(`Part 1: ${part1(patterns)}`);
  console.log(`Part 2: ${part2(patterns)}`);
};

const isMirror = (base) => base.join('') == base.reverse().join('');

const part1 = (patterns) => reflectionLines(patterns, (pc) => pc.every((row) => isMirror([...row])));

const findSmudges = (pattern) => {
  const smudgeCount = pattern.reduce((acc, row) => {
    for (let i = 0; i <= pattern[0].length; i += 2) {
      acc = row[i] !== row[row.length - (i + 1)] ? acc + 1 : acc;
    }
    return acc;
  }, 0);
  return smudgeCount === 1;
};

const part2 = (patterns) => reflectionLines(patterns, findSmudges);

const reflectionLines = (patterns, mirrorTest) => {
  const reflectionPoints = patterns.map((pattern) => {
    const columnMirrors = findMirrors([...pattern.columns], mirrorTest);
    const { start, end } = columnMirrors ? columnMirrors : findMirrors([...pattern.rows], mirrorTest);
    return { column: !!columnMirrors, ...{ start, end } };
  });
  return finalResult(
    reflectionPoints.map((mirror) =>
      mirror.column
        ? Math.ceil(mirror.start + (mirror.end - mirror.start) / 2)
        : Math.ceil(mirror.start + (mirror.end - mirror.start) / 2) * 100,
    ),
  );
};

const findMirrors = (pattern, mirrorTest) => {
  let result;
  searchLoop: for (let direction of Array.of('rtl', 'ltr')) {
    const isRTL = direction === 'rtl';
    let patternCopy =
      pattern[0] % 2 === 0 ? [...pattern] : [...pattern.map((row) => [...row].toSpliced(isRTL ? -1 : 0, 1))];
    while (!result && patternCopy[0].length >= 2) {
      const foundReflection = mirrorTest(patternCopy);
      if (foundReflection) {
        const mirror = isRTL ? patternCopy[0].length : pattern[0].length - patternCopy[0].length;
        result = { start: isRTL ? 0 : mirror, end: isRTL ? mirror : pattern[0].length - 1 };
        break;
      }
      patternCopy = patternCopy.map((row) => [...row.toSpliced(isRTL ? -2 : 0, 2)]);
    }
    if (result) break searchLoop;
  }
  return result;
};

const finalResult = (mirrors) =>
  mirrors.reduce((acc, mirror) => {
    acc += mirror;
    return acc;
  }, 0);
