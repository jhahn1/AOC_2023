import { testInput1, input } from './input.js';
import { prettyLog } from '../util.js';
const part2 = true;
export const mirageMaintenance = async () => {
  const rows = input.split('\n');
  const readings = rows.map((row) => row.split(' ').map((val) => parseInt(val.replaceAll(' ', ''))));
  const sequencePromises = readings.map(async (reading) => await calculateSequences(reading, [reading]));
  const sequences = await Promise.all(sequencePromises);
  const extrapolatePromises = sequences.map(async (seq) => await extrapolate(seq, part2));
  const extrapolations = await Promise.all(extrapolatePromises);
  const result = extrapolations.reduce((acc, e) => {
    acc = acc + e;
    return acc;
  }, 0);
  console.log(`result: ${result}`);
};

const extrapolate = async (sequences, part2) => {
  const result = sequences.reverse().reduce((acc, data) => {
    acc = part2 ? data[0] - acc : acc + data[data.length - 1];
    return acc;
  }, 0);
  return result;
};

const calculateSequences = async (data, sequences) => {
  const sequence = [];
  data.reduce((acc, d) => {
    sequence.push(d - acc);
    acc = d;
    return acc;
  });
  sequences.push(sequence);
  return sequence.every((s) => s === 0) ? sequences : calculateSequences(sequences[sequences.length - 1], sequences);
};
