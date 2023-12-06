import { testInput1, input1 } from './input.js';
export const scratchcards = () => {
  const cardRows = input1.split('\n');
  const wins = part2(cardRows);
  console.log(wins);
};

const part2 = (cardRows) => {
  const cardMap = new Map();
  cardRows.forEach((cr) => {
    const { cardNumber, winningNumbers, yourNumbers } = getCardResult(cr);
    cardMap.set(cardNumber, { winning: winningNumbers, yours: yourNumbers, cardCount: 1 });
  });
  return getTickets(cardMap);
};

const getTickets = (cardMap) => {
  cardMap.forEach(({ winning, yours, cardCount }, key) => {
    console.log(`cardNumber Key: ${key}`);
    let wins = 0;
    yours.forEach((num) => {
      if (winning.includes(num)) {
        wins += 1;
      }
    });
    for (let j = 0; j < cardCount; j++) {
      for (let i = 1; i < wins + 1; i++) {
        const copy = cardMap.get(`${parseInt(key) + i}`);
        cardMap.set(`${parseInt(key) + i}`, {
          ...copy,
          cardCount: copy.cardCount + 1,
        });
      }
    }
  });
  let totalScratchCards = 0;
  cardMap.forEach(({ cardCount }) => (totalScratchCards += cardCount));
  return totalScratchCards;
};

const part1 = (cardRows) => {
  let totalWins = 0;
  cardRows.forEach((cr) => {
    let winCount = 0;
    const { winningNumbers, yourNumbers } = getCardResult(cr);
    yourNumbers.forEach((yourNum) => {
      if (winningNumbers.includes(yourNum)) {
        winCount = winCount === 0 ? 1 : winCount * 2;
      }
    });
    totalWins += winCount;
  });
  return totalWins;
};

const getCardResult = (cr) => {
  const [card, values] = cr.split(':');
  let cardNumber = card.split(' ');
  cardNumber = cardNumber[cardNumber.length - 1].replace(' ', '');
  const [winningNumbers, yourNumbers] = values.split('|');
  const winningNumberList = winningNumbers.trim().split(' ');
  const yourNumberList = yourNumbers.trim().split(' ');
  const winningNumberListTrimmed = winningNumberList.map((wn) => wn.trim()).filter((wn) => wn !== '');
  const yourNumberListTrimmed = yourNumberList.map((yn) => yn.trim()).filter((yn) => yn !== '');
  const yourNumbersSet = new Set(yourNumberListTrimmed);
  const winningNumbersSet = new Set(winningNumberListTrimmed);
  return { cardNumber: cardNumber, winningNumbers: [...winningNumbersSet], yourNumbers: [...yourNumbersSet] };
};
