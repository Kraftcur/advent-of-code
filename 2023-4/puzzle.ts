import { getReaderInterface } from '../file';

const run = () => {
  var lineReader = getReaderInterface('./2023-4/input.txt');

  puzzle(lineReader);
};

class Game {
  gameId: string = '';
  winningNumbers: string[] = [];
  myNumbers: string[] = [];
  matchingNumbers: string[] = [];
  gameScore: number = 0;

  constructor(gameId: string, winningNumbers: string[], myNumbers: string[]) {
    this.gameId = gameId;
    this.winningNumbers = winningNumbers;
    this.myNumbers = myNumbers;
  }

  checkWinningNumbers() {
    this.matchingNumbers = this.winningNumbers.map((winningNumber) => {
      let foundNum = this.myNumbers.find((val) => val === winningNumber);
      if (foundNum) {
        if (!this.gameScore) {
          this.gameScore = 1;
        } else {
          this.gameScore = this.gameScore * 2;
        }
        return foundNum;
      }
    }) as string[];
  }
}

function puzzle(lineReader: any): void {
  let games: Game[] = [];
  let allGamesScore: number = 0;
  lineReader.on('line', (line: string) => {
    let splitVal = line.indexOf(':');
    let gameId = line.substring(line.indexOf(' '), splitVal);
    let game = line.substring(splitVal + 2).split('|');
    let currentGame = new Game(gameId, game[0].split(' '), game[1].split(' '));
    currentGame.checkWinningNumbers();
    games.push(currentGame);

    allGamesScore = allGamesScore + Number(currentGame.gameScore);
  });

  lineReader.on('close', () => {
    console.log('Answer: ', allGamesScore);
  });
}

run();
// Answer:  25174
