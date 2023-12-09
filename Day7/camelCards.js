import { testInput1, input } from './input.js';
import { prettyLog } from '../util.js';

let isPart2 = true;

export const camelCards = async () => {
  const inputRows = input.split('\n');
  const gameHands = inputRows.map((ir) => ir.split(' '));
  isPart2 ? part2(gameHands) : part1(gameHands);
};

const handTypes = {
  fiveOfAKind: { test: (cards) => cards.includes(5), jokerUpgrade: () => 'fiveOfAKind', rank: 7 },
  fourOfAKind: { test: (cards) => cards.includes(4), jokerUpgrade: () => 'fiveOfAKind', rank: 6 },
  fullHouse: {
    test: (cards) => cards.includes(3) && Object.values(cards).includes(2),
    jokerUpgrade: () => 'fiveOfAKind',
    rank: 5,
  },
  threeOfAKind: {
    test: (cards) => cards.includes(3),
    jokerUpgrade: (jokerCount) => (jokerCount === 1 ? 'fourOfAKind' : 'fiveOfAKind'),
    rank: 4,
  },
  twoPair: {
    test: (cards) => cards.filter((count) => count === 2).length === 2,
    jokerUpgrade: () => 'fullHouse',
    rank: 3,
  },
  pair: {
    test: (cards) => cards.includes(2),
    jokerUpgrade: (jokerCount) =>
      jokerCount === 1 ? 'threeOfAKind' : jokerCount === 2 ? 'fourOfAKind' : 'fiveOfAKind',
    rank: 2,
  },
  highCard: {
    test: (cards) => cards.every((c) => c === 1),
    jokerUpgrade: (jokerCount) =>
      jokerCount === 1 ? 'pair' : jokerCount === 2 ? 'threeOfAKind' : jokerCount === 3 ? 'fourOfAKind' : 'fiveOfAKind',
    rank: 1,
  },
};

const upgradeJokers = async (currentHand) => {
  const newHand = handTypes[currentHand.type].jokerUpgrade(currentHand.jokerCount);
  const intValue = await getHandIntValue(currentHand.cards);
  return { ...currentHand, type: newHand, rank: handTypes[newHand].rank, intValue };
};

const charLabels = ['A', 'K', 'Q', 'J', 'T'];
const getCharLabels = isPart2 ? charLabels.filter((cl) => cl !== 'J') : charLabels;
const getLabelRank = (label) => (isNaN(label) ? charLabelRanks[label] : label.padStart(2, '0'));
const charLabelRanks = getCharLabels.reduce((acc, v, i) => {
  acc[v] = `${isPart2 ? 13 - i : 14 - i}`;
  return acc;
}, {});

const part2 = async (gameHands) => {
  const hands = [];
  const handsPromises = gameHands.map(async ([card, bid]) => {
    const noJokers = card.replaceAll('J', '');
    hands.push({ ...(await inputToCard(noJokers, bid)), jokerCount: 5 - noJokers.length, cards: card });
  });
  await Promise.all(handsPromises);
  const jokerHandUpgrades = hands
    .filter((hand) => hand.jokerCount > 0)
    .map(async (jokerHand) => upgradeJokers(jokerHand));
  const jokerHandsResolved = await Promise.all(jokerHandUpgrades);
  const allHands = [...hands.filter((hand) => hand.jokerCount === 0), ...jokerHandsResolved];
  calculateWinnings(allHands);
};

const part1 = async (gameHands) => {
  const hands = [];
  const handsPromises = gameHands.map(async ([card, bid]) => {
    hands.push(await inputToCard(card, bid));
  });
  await Promise.all(handsPromises);
  calculateWinnings(hands);
};

const inputToCard = async (cards, bid) => {
  const counts = cardsCounts(cards);
  const { type, rank } = await getHand(Object.values(counts));
  const intValue = await getHandIntValue(cards);
  return { cards, bid, counts, type, rank, intValue };
};

const cardsCounts = (cards) =>
  cards
    .split('')
    .map((c) => c.trim())
    .reduce((acc, card) => {
      acc[card] = acc[card] ? acc[card] + 1 : 1;
      return acc;
    }, {});

const getHandIntValue = async (cards) => {
  const labels = cards.split('');
  return parseFloat(
    `1.${labels.reduce((acc, label) => {
      acc += isPart2 && label === 'J' ? '01' : getLabelRank(label);
      return acc;
    }, '')}`,
  );
};

const getHand = async (cardCounts) => {
  let handTypeResult;
  let foundHand = false;
  let iterator = 0;
  const handTypesLength = Object.keys(handTypes).length;
  while (!foundHand && iterator < handTypesLength) {
    const [type, { test, rank }] = Object.entries(handTypes)[iterator];
    if (test(cardCounts)) {
      handTypeResult = { type, rank };
      foundHand = true;
      break;
    } else {
      iterator += 1;
    }
  }
  return handTypeResult;
};

const calculateWinnings = (hands) => {
  const sortedByHand = hands.sort((a, b) => b.rank - a.rank);
  const topHands = sortedByHand.filter((hrr) => hrr.rank === sortedByHand[0].rank);
  sortedByHand.splice(0, topHands.length);
  const sortedTopHands = topHands.sort((a, b) => b.intValue - a.intValue);
  const sortedRemaining = Object.keys(handTypes)
    .map((type) => {
      const cardsOfType = sortedByHand.filter((h) => h.type === type);
      return cardsOfType.sort((a, b) => b.intValue - a.intValue);
    })
    .flat();
  const rankedHands = [...sortedTopHands, ...sortedRemaining];
  const result = rankedHands.reverse().reduce((acc, hand, index) => {
    acc += hand.bid * (index + 1);
    return acc;
  }, 0);
  console.log(`result length: ${rankedHands.length}`);
  console.log(`result: ${result}`);
};
