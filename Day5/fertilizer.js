import { testInput1, testInput2, input } from './input.js';

export const fertilizer = () => {
  const inputParsed = input.split('\n');
  const almanacRows = inputParsed.filter((ip) => !!ip);
  part2(almanacRows);
};

const part2 = (almanacRows) => {
  const [, values] = almanacRows[0].split(':');
  let cleanSeedRanges = values.split(' ');
  cleanSeedRanges = cleanSeedRanges.filter((sr) => !!sr).map((sr) => parseInt(sr.trim().replace(' ', '')));
  const seedRanges = [];
  for (let i = 0; i <= cleanSeedRanges.length - 1; i += 2) {
    seedRanges.push({ start: cleanSeedRanges[i], stop: cleanSeedRanges[i] + cleanSeedRanges[i + 1] });
  }
  const almanac = buildAlmanac(almanacRows);
  for (let i = 0; i < Infinity; i++) {
    const seedValue = almanac.reduceRight((acc, map) => {
      const { ranges } = map;
      let foundRange = false;
      let rangeIterator = 0;
      while (!foundRange && rangeIterator < ranges.length) {
        const { destRangeStart, sourceRangeStart, rangeLength } = ranges[rangeIterator];
        if (acc >= destRangeStart && acc < destRangeStart + rangeLength) {
          acc = acc + (sourceRangeStart - destRangeStart);
          foundRange = true;
          break;
        }
        rangeIterator += 1;
      }
      return acc;
    }, i);
    if (seedRanges.some((sr) => sr.start < seedValue && sr.stop > seedValue)) {
      console.log(`SeedValue: ${seedValue}`);
      console.log(`ANSWER: ${i}`);
      break;
    }
  }
};

const part1 = (almanacRows) => {
  const [, values] = almanacRows[0].split(':');
  const almanac = buildAlmanac(almanacRows);
  const seedMapResults = values
    .split(' ')
    .filter((i) => !!i)
    .map((v) => parseInt(v.replace(' ', '')))
    .map((seed) => {
      console.log(`seed: ${seed}`);
      const seedResult = almanac.reduce((acc, map) => {
        const { source, destination, ranges } = map;
        const prevDestinationNumber = acc?.[seed]?.[source] ? acc[seed][source] : seed;
        let destinationNumber;
        ranges.forEach((range) => {
          const { destRangeStart, sourceRangeStart, rangeLength } = range;
          if (prevDestinationNumber >= sourceRangeStart && prevDestinationNumber < sourceRangeStart + rangeLength) {
            destinationNumber = prevDestinationNumber + (destRangeStart - sourceRangeStart);
          }
        });
        if (!destinationNumber) {
          destinationNumber = prevDestinationNumber;
        }
        acc[seed] = acc[seed]
          ? { ...acc[seed], [destination]: destinationNumber }
          : { [destination]: destinationNumber };
        return acc;
      }, {});
      return seedResult;
    });
  const lowestLocation = seedMapResults.reduce((acc, smr) => {
    const locationVal = Object.values(smr)[0].location;
    if (locationVal < acc) {
      acc = locationVal;
    }
    return acc;
  }, Infinity);
  console.log(lowestLocation);
};

const buildAlmanac = (almanacRows) =>
  almanacRows.slice(1).reduce((acc, row) => {
    if (row.includes('map')) {
      const label = row.split(' ')[0];
      const [source, , destination] = label.split('-');
      acc.push({ source, destination });
    } else {
      const values = row.split(' ');
      const [destRangeStart, sourceRangeStart, rangeLength] = values
        .map((v) => v.replace(' ', ''))
        .map((i) => parseInt(i));
      acc[acc.length - 1] = {
        ...acc[acc.length - 1],
        ranges: acc[acc.length - 1]?.ranges
          ? [...acc[acc.length - 1].ranges, { destRangeStart, sourceRangeStart, rangeLength }]
          : [{ destRangeStart, sourceRangeStart, rangeLength }],
      };
    }
    return acc;
  }, []);
