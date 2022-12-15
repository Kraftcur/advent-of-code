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

function calculatePerimeter(xLength: number, yLength: number): number {
  console.log(xLength);
  console.log(yLength);
  return xLength * 2 + yLength * 2 - 4;
}

function isVisible(index: number, row: number[]): boolean[] {
  let lr: boolean[] = [true, true];

  // Check numbers to the left of the given index
  for (let i = index - 1; i >= 0; i--) {
    if (row[i] >= row[index]) {
      lr[0] = false;
      break;
    }
  }

  // Check numbers to the right of the given index
  for (let i = index + 1; i < row.length; i++) {
    if (row[i] >= row[index]) {
      lr[1] = false;
      break;
    }
  }

  return lr;
}

function createVisibleCordsMap(
  visibleCordsMap: Map<string, boolean[]>,
  grid: number[][],
  isYGrid: boolean
): void {
  for (let yCord = 0; yCord < grid.length; yCord++) {
    for (let xCord = 0; xCord < grid[yCord].length; xCord++) {
      let isTreeVisible = isVisible(xCord, grid[yCord]);
      let xyKey: string;
      if (isYGrid) {
        xyKey = [yCord, xCord].join(',');
      } else {
        xyKey = [xCord, yCord].join(',');
      }
      if (visibleCordsMap.has(xyKey)) {
        visibleCordsMap.set(xyKey, [
          ...visibleCordsMap.get(xyKey)!,
          ...isTreeVisible,
        ]);
      } else {
        visibleCordsMap.set(xyKey, isTreeVisible);
      }
    }
  }
}

function puzzle(lineReader: any): void {
  let xGrid: number[][] = [];
  let yGrid: number[][] = [];
  let visibleCordsMap: Map<string, boolean[]> = new Map();

  let perimeterTreeCount: number = 0;

  lineReader.on('line', (line: string) => {
    let xRow = line.split('').map(Number);
    yGrid = createYGrid(yGrid, xRow);
    xGrid.push(xRow);
  });

  lineReader.on('close', () => {
    perimeterTreeCount = calculatePerimeter(xGrid.length, yGrid.length);
    createVisibleCordsMap(visibleCordsMap, xGrid, false);
    createVisibleCordsMap(visibleCordsMap, yGrid, true);
    console.log(visibleCordsMap);
    const trueEntries = Array.from(visibleCordsMap.entries())
      .filter(([_, values]) => values.some((value) => value === true))
      .map(([key, _]) => key);
    console.log(trueEntries.length, trueEntries);
  });
}

run();
