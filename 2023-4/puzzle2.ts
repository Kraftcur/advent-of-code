import { getReaderInterface } from '../file';

const run = () => {
  var lineReader = getReaderInterface('./2023-4/input.txt');

  puzzle(lineReader);
};

let copiesMap: Map<number, number> = new Map();

class Game {
  gameId: number;
  winningNumbers: string[] = [];
  myNumbers: string[] = [];
  matchingNumbers: string[] = [];
  gameScore: number = 0;
  numberOfWinners: number = 0;
  numberOfCopies: number = 1;

  constructor(gameId: string, winningNumbers: string[], myNumbers: string[]) {
    this.gameId = Number(gameId);
    this.winningNumbers = winningNumbers;
    this.myNumbers = myNumbers;
  }

  playGame() {
    this.matchingNumbers = this.winningNumbers.map((winningNumber) => {
      let foundNum = this.myNumbers.find((val) => val === winningNumber);
      if (foundNum) {
        this.numberOfWinners = this.numberOfWinners + 1;
        if (!this.gameScore) {
          this.gameScore = 1;
        } else {
          this.gameScore = this.gameScore * 2;
        }
        return foundNum;
      }
    }) as string[];
    this.setFinalNumberOfCopies();
    this.addCopies();
  }

  addCopies() {
    let startingNumber = this.gameId;
    [...Array(this.numberOfCopies)].forEach((v, i) => {
      [...Array(this.numberOfWinners)].forEach((value, index) => {
        let gameIdKey = startingNumber + index + 1;
        let currentCopies = copiesMap.get(gameIdKey) || 1;
        copiesMap.set(gameIdKey, currentCopies + 1);
      });
    });
  }

  setFinalNumberOfCopies() {
    if (copiesMap.has(this.gameId)) {
      this.numberOfCopies = copiesMap.get(this.gameId) as number;
    } else {
      copiesMap.set(this.gameId, 1);
    }
  }
}

function puzzle(lineReader: any): void {
  let allGamesScore: number = 0;
  let totalNumberOfScratchcards: number = 0;
  lineReader.on('line', (line: string) => {
    let splitVal = line.indexOf(':');
    let gameId = line.substring(line.indexOf(' '), splitVal);
    let game = line.substring(splitVal + 2).split('|');

    let currentGame = new Game(gameId, game[0].split(' '), game[1].split(' '));
    currentGame.playGame();

    allGamesScore = allGamesScore + Number(currentGame.gameScore);
    totalNumberOfScratchcards =
      totalNumberOfScratchcards + currentGame.numberOfCopies;
  });

  lineReader.on('close', () => {
    console.log('Answer: ', totalNumberOfScratchcards);
  });
}

run();
// Answer:  6420979
