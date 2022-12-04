import readline from 'readline';
import fs from 'fs';

type State = 'FULLY_OVERLAPS' | 'NO_OVERLAP' | 'PARTIAL_OVERLAPS';

const getReader = () => {
  return readline.createInterface({
    input: fs.createReadStream('./input.txt'),
  });
};

const run = () => {
  var lineReader = getReader();

  puzzle1(lineReader);
};

const puzzle1 = (lineReader: any) => {
  const overlapMap = new Map<State, number>();

  lineReader.on('line', (line: string) => {
    let pairList: number[][] = line
      .split(',')
      .map((range) => range.split('-').map(Number));
    let overlap: State = compareOverlap(pairList);

    if (overlapMap.has(overlap)) {
      overlapMap.set(overlap, overlapMap.get(overlap)! + 1);
    } else {
      overlapMap.set(overlap, 1);
    }
  });

  lineReader.on('close', () => {
    console.log(overlapMap);
  });
};

function compareOverlap(pairList: number[][]): State {
  if (pairList[0][1] < pairList[1][0] || pairList[0][0] > pairList[1][1]) {
    return 'NO_OVERLAP';
  }

  if (pairList[0][0] <= pairList[1][0] && pairList[0][1] >= pairList[1][1]) {
    // left dominant
    return 'FULLY_OVERLAPS';
  }

  if (pairList[1][0] <= pairList[0][0] && pairList[1][1] >= pairList[0][1]) {
    // right dominant
    return 'FULLY_OVERLAPS';
  }

  return 'PARTIAL_OVERLAPS';
}

run();
