import readline from 'readline';
import fs from 'fs';

type TheirMove = 'A' | 'B' | 'C';
type MyMove = 'X' | 'Y' | 'Z';

enum MovePoints {
  A = 1,
  B = 2,
  C = 3,
  X = 1,
  Y = 2,
  Z = 3,
}

enum ResultPoints {
  Loss = 0,
  Tie = 3,
  Win = 6,
}

interface GameResult {
  theirResult: ResultPoints;
  myResult: ResultPoints;
}

const win: GameResult = {
  theirResult: ResultPoints.Loss,
  myResult: ResultPoints.Win,
};

const loss: GameResult = {
  theirResult: ResultPoints.Win,
  myResult: ResultPoints.Loss,
};

const tie: GameResult = {
  theirResult: ResultPoints.Tie,
  myResult: ResultPoints.Tie,
};

class MyGame {
  myGamePoints: number;
  theirGamePoints: number;
  theirMove: MovePoints;
  myMove: MovePoints;
  gameResult: GameResult;

  constructor(theirMoveInPoints: MovePoints, myMoveInPoints: MovePoints) {
    this.theirMove = theirMoveInPoints;
    this.myMove = myMoveInPoints;
    this.gameResult = this.getResults();
    this.myGamePoints = this.calculateMyPoints();
    this.theirGamePoints = this.calculateTheirPoints();
  }

  calculateMyPoints(): number {
    return this.gameResult.myResult.valueOf() + this.myMove.valueOf();
  }

  calculateTheirPoints(): number {
    return this.gameResult.theirResult.valueOf() + this.theirMove.valueOf();
  }

  getResults(): GameResult {
    if (this.myMove === this.theirMove) {
      return tie;
    } else {
      if (this.myMove === 1) {
        if (this.theirMove === 3) return win;
        else return loss;
      } else if (this.myMove === 2) {
        if (this.theirMove === 1) return win;
        else return loss;
      } else {
        if (this.theirMove === 2) return win;
        else return loss;
      }
    }
  }
}

const run = () => {
  var lineReader = readline.createInterface({
    input: fs.createReadStream('./input.txt'),
  });

  var myTotalPoints: number = 0;
  var theirTotalPoints: number = 0;

  lineReader.on('line', (line: string) => {
    const moves = line.split(' ');
    let theirMove = moves[0] as TheirMove;
    let myMove = moves[1] as MyMove;
    let theirPoints = MovePoints[theirMove];
    let myPoints = MovePoints[myMove];
    const game = new MyGame(theirPoints, myPoints);
    myTotalPoints += game.myGamePoints;
    theirTotalPoints += game.theirGamePoints;
  });

  lineReader.on('close', () => {
    console.log('myTotalPoints: ' + myTotalPoints);
    console.log('theirTotalPoints: ' + theirTotalPoints);
  });
};

run();
