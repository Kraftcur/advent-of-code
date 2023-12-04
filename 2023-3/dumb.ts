import { getReaderInterface } from '../file';

// nice job reading instructions... this is not answering the right question

class Gears {
  movingGearGroup: string[] = Array(3);
  foundGears: Map<string, number> = new Map();
  gearRatioSum: number = 0;

  constructor() {}

  addElement(element: string) {
    this.movingGearGroup.unshift(element);
    this.movingGearGroup.pop();
    console.log(this.movingGearGroup);
    if (this.checkGearGroup()) {
      let key = `${this.movingGearGroup[2]}${this.movingGearGroup[1]}${this.movingGearGroup[0]}`;
      let value =
        Number(this.movingGearGroup[0]) * Number(this.movingGearGroup[2]);
      if (this.foundGears.has(key)) {
        console.log('Same number combo found twice');
      }
      this.foundGears.set(key, value);
      this.gearRatioSum = this.gearRatioSum + value;
    }
  }

  checkGearGroup() {
    let firstMatch: boolean = this.isNumber(this.movingGearGroup[0]);
    let starMatch: boolean = this.movingGearGroup[1] === '*';
    let secondMatch: boolean = this.isNumber(this.movingGearGroup[2]);
    return firstMatch && starMatch && secondMatch;
  }

  isNumber(element: string) {
    return typeof Number(element) === 'number' && !isNaN(Number(element));
  }
}

const run = () => {
  var lineReader = getReaderInterface('./2023-3/input.txt');

  puzzle(lineReader);
};

let gears: Gears = new Gears();

function puzzle(lineReader: any): void {
  lineReader.on('line', (line: string) => {
    let number: string = '';
    for (let char of line) {
      if (gears.isNumber(char)) {
        number = number.concat(char);
        continue;
      }

      if (number) {
        gears.addElement(number);
        number = '';
      }

      if (char !== '.') {
        gears.addElement(char);
      }
    }
  });

  lineReader.on('close', () => {
    console.log('Answer: ', gears.foundGears, gears.gearRatioSum);
  });
}

run();
