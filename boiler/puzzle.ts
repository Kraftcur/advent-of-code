import { getReaderInterface } from '../file';

const run = () => {
  var lineReader = getReaderInterface('./2022-5/input.txt');

  puzzle(lineReader);
};

function puzzle(lineReader: any): void {
  let output: any;
  lineReader.on('line', (line: string) => {});

  lineReader.on('close', () => {
    console.log('Answer: ', output);
  });
}

run();
