import { getReaderInterface } from '../file';

const run = () => {
  var lineReader = getReaderInterface('./2022-8/input.txt');

  puzzle(lineReader);
};

function createYGrid(yGrid: number[][], xRow: number[]): number[][] {
  for (let i = 0; i < xRow.length; i++) {
    if (yGrid[i] === undefined) {
      yGrid[i] = [];
    }
    yGrid[i].push(xRow[i]);
  }
  return yGrid;
}

function getSenicScore(index: number, row: number[]): number[] {
  let lr: number[] = [0, 0];

  // Check numbers to the left of the given index
  let numLeftTrees = 0;
  for (let i = index - 1; i >= 0; i--) {
    numLeftTrees++;
    if (row[i] >= row[index] || i === 0) {
      lr[0] = numLeftTrees;
      break;
    }
  }

  // Check numbers to the right of the given index
  let numRightTrees = 0;
  for (let i = index + 1; i < row.length; i++) {
    numRightTrees++;
    if (row[i] >= row[index] || i === row.length - 1) {
      lr[1] = numRightTrees;
      break;
    }
  }

  return lr;
}

function createsenicScoreDirectionMap(
  senicScoreDirectionMap: Map<string, number[]>,
  grid: number[][],
  isYGrid: boolean
): void {
  for (let yCord = 0; yCord < grid.length; yCord++) {
    for (let xCord = 0; xCord < grid[yCord].length; xCord++) {
      let senicScore = getSenicScore(xCord, grid[yCord]);
      let xyKey: string;
      if (isYGrid) {
        xyKey = [yCord, xCord].join(',');
      } else {
        xyKey = [xCord, yCord].join(',');
      }
      if (senicScoreDirectionMap.has(xyKey)) {
        senicScoreDirectionMap.set(xyKey, [
          ...senicScoreDirectionMap.get(xyKey)!,
          ...senicScore,
        ]);
      } else {
        senicScoreDirectionMap.set(xyKey, senicScore);
      }
    }
  }
}

function puzzle(lineReader: any): void {
  let xGrid: number[][] = [];
  let yGrid: number[][] = [];
  let senicScoreDirectionMap: Map<string, number[]> = new Map();

  lineReader.on('line', (line: string) => {
    let xRow = line.split('').map(Number);
    yGrid = createYGrid(yGrid, xRow);
    xGrid.push(xRow);
  });

  lineReader.on('close', () => {
    createsenicScoreDirectionMap(senicScoreDirectionMap, xGrid, false);
    createsenicScoreDirectionMap(senicScoreDirectionMap, yGrid, true);
    const productMap = new Map<string, number>();
    senicScoreDirectionMap.forEach((values, key) =>
      productMap.set(
        key,
        values.reduce((product, value) => product * value)
      )
    );
    const largestValue = Math.max(...productMap.values());
    console.log(largestValue);
  });
}

run();
