import { getReaderInterface } from '../file';

type State = 'FULLY_OVERLAPS' | 'NO_OVERLAP' | 'PARTIAL_OVERLAPS';

const run = () => {
  var lineReader = getReaderInterface('./2022-4/input.txt');

  puzzle1(lineReader);
  sameProblemWrittenByAI(lineReader);
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

function sameProblemWrittenByAI(lineReader: any) {
  const overlapMap = new Map<State, number>();

  lineReader.on('line', (line: string) => {
    let pairList: string[] = line.split(',');
    let overlap: State = rangeOverlap(pairList[0], pairList[1]);

    if (overlapMap.has(overlap)) {
      overlapMap.set(overlap, overlapMap.get(overlap)! + 1);
    } else {
      overlapMap.set(overlap, 1);
    }
  });

  lineReader.on('close', () => {
    console.log('AI little off: ', overlapMap);
  });
}

function rangeOverlap(range1: string, range2: string): State {
  const [start1, end1] = range1.split('-').map(Number);
  const [start2, end2] = range2.split('-').map(Number);

  // Check for full overlap
  if (start1 <= start2 && end1 >= end2) return 'FULLY_OVERLAPS';
  if (start2 <= start1 && end2 >= end1) return 'FULLY_OVERLAPS';

  // Check for partial overlap
  if (
    (start1 <= start2 && start2 <= end1) ||
    (start2 <= start1 && start1 <= end2)
  )
    return 'PARTIAL_OVERLAPS';

  return 'NO_OVERLAP';
}

run();
