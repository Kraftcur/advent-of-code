import readline from 'readline';
import fs from 'fs';

type TheirMove = 'A' | 'B' | 'C';
type MyMove = 'X' | 'Y' | 'Z';

enum ExpectedPoints {
  X = 0,
  Y = 3,
  Z = 6,
}

enum Points {
  A = 1,
  B = 2,
  C = 3,
}

const getMyMovePoints = (theirMove: TheirMove, expected: ExpectedPoints) => {
  let move = theirMove.valueOf();
  switch (expected) {
    case ExpectedPoints.X: // lose
      if (move === 'A') return Points.C;
      else if (move === 'B') return Points.A;
      else return Points.B;
    case ExpectedPoints.Y: // tie
      return Points[theirMove];
    case ExpectedPoints.Z: // win
      if (move === 'A') return Points.B;
      else if (move === 'B') return Points.C;
      else return Points.A;
  }
};

const run = () => {
  var lineReader = readline.createInterface({
    input: fs.createReadStream('./input.txt'),
  });

  var myTotalPoints: number = 0;

  lineReader.on('line', (line: string) => {
    const moves = line.split(' ');
    let theirMove = moves[0] as TheirMove;
    let myMove = moves[1] as MyMove;
    let expectedResult: number = ExpectedPoints[myMove];
    let myMovePoints = getMyMovePoints(theirMove, expectedResult);
    myTotalPoints += myMovePoints + expectedResult;
  });

  lineReader.on('close', () => {
    console.log('myTotalPoints: ' + myTotalPoints);
  });
};

run();
