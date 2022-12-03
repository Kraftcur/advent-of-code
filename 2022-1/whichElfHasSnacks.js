import fs from 'fs';
import split2 from 'split2';
import readline from 'readline';
import Stack from './Stack.js';

const whosGotSnacks = () => {
  var mostCalories = 0;
  var currentCalories = 0;

  var file = fs.createReadStream('./input.txt');
  file
    .pipe(split2())
    .on('data', function (line) {
      //each chunk now is a separate line!
      let snackCal = parseInt(line);

      if (isNaN(snackCal)) {
        if (currentCalories > mostCalories) {
          mostCalories = currentCalories;
        }
        currentCalories = 0;
      } else {
        currentCalories += snackCal;
      }
    })
    .on('close', () => {
      resolveIt(1, mostCalories);
    });
};

const whosGotSnacks2 = () => {
  const data = fs.readFileSync('./input.txt', 'utf8');
  let elfArrayString = data.split('\n\n');
  let totalCalsPerElf = elfArrayString.map((value) => {
    return value
      .split('\n')
      .map(Number)
      .reduce((partialSum, a) => partialSum + a, 0);
  });
  return Math.max(...totalCalsPerElf);
};

const whosGotSnacks3 = () => {
  var mostCalories = 0;
  var currentCalories = 0;
  var topCalorieArray = new Stack(3);

  // arr.insert(index, item)

  var lineReader = readline.createInterface({
    input: fs.createReadStream('./input.txt'),
  });

  lineReader.on('line', function (line) {
    let snackCal = parseInt(line);
    if (isNaN(snackCal)) {
      topCalorieArray.push(currentCalories);
      if (currentCalories > mostCalories) {
        mostCalories = currentCalories;
      }
      currentCalories = 0;
    } else {
      currentCalories += snackCal;
    }
  });

  lineReader.on('close', () => {
    resolveIt(3, topCalorieArray.sum());
  });
};

const resolveIt = (number, output) => {
  console.log(number, output);
};

const run = () => {
  whosGotSnacks();

  console.log(2, whosGotSnacks2());

  whosGotSnacks3();
};

run();
