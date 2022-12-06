import { getReaderInterface } from '../file';
import fs from 'fs';

const run = () => {
  var lineReader = getReaderInterface('./2022-6/input.txt');

  puzzle(lineReader, 4);
  puzzle(lineReader, 14);
};

function hasDuplicates(array: string[]): boolean {
  return new Set(array).size !== array.length;
}

function puzzle(lineReader: any, markerSize: number): void {
  var file = fs.createReadStream('./2022-6/input.txt', 'utf8');

  let marker: string[] = [];
  let indexOfMarker: number = 0;
  file.on('readable', function (data: any) {
    let chunk: string;
    let index: number = 0;
    let array: string[] = [];
    while (null !== (chunk = file.read(1)) && indexOfMarker === 0) {
      index++;
      array.push(chunk);
      if (array.length > markerSize - 1) {
        let possibleMarker = array.slice(index - markerSize, index);
        if (!hasDuplicates(possibleMarker)) {
          console.log(index, possibleMarker);
          marker = possibleMarker;
          indexOfMarker = index;
        }
      }
    }
  });
}

run();
