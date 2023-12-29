import { testInput1, input1 } from './input.js';
import { prettyLog } from '../util.js';
export const lensLibrary = () => {
  const codes = input1.split(',');
  console.log(part1(codes));
  console.log(part2(codes));
};

const part2 = (codes) => {
  const boxes = codes.reduce((boxes, code) => {
    const [label, focalLength] = code.includes('=') ? code.split('=') : code.split('-');
    const boxNumber = valueFromCode(label);
    if (boxes.has(boxNumber)) {
      const box = boxes.get(boxNumber);
      const updateIndex = box.findIndex((b) => b.label === label);
      if (updateIndex !== -1) {
        if (!focalLength) {
          box.splice(updateIndex, 1);
        } else {
          box.splice(updateIndex, 1, { label, focalLength });
        }
      } else if (focalLength) {
        boxes.set(boxNumber, [...boxes.get(boxNumber), { label, focalLength }]);
      }
    } else if (focalLength) {
      boxes.set(boxNumber, [{ label, focalLength }]);
    }
    return boxes;
  }, new Map());
  let sum = 0;
  for (const [key, value] of boxes) {
    value.forEach((val, index) => {
      const power = (index + 1) * (key + 1) * val.focalLength;
      sum += power;
    });
  }
  return sum;
};

const part1 = (codes) =>
  codes.reduce((answer, code) => {
    const value = valueFromCode(code);
    answer += value;
    return answer;
  }, 0);

const valueFromCode = (code) =>
  code.split('').reduce((acc, char) => {
    acc = ((acc + char.charCodeAt(0)) * 17) % 256;
    return acc;
  }, 0);
