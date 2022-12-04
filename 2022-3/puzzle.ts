import readline from 'readline';
import fs from 'fs';

const getReader = () => {
  return readline.createInterface({
    input: fs.createReadStream('./input.txt'),
  });
};

const run = () => {
  var lineReader = getReader();

  puzzle1(lineReader);
  puzzle2(lineReader);
};

const puzzle1 = (lineReader: any) => {
  var sumOfPriority = 0;

  lineReader.on('line', (line: string) => {
    const length = line.length;

    const firstHalf = line.slice(0, length / 2);
    const secondHalf = line.slice(line.length / 2, length);

    const same = checkIfStringsContainSameCharacters(firstHalf, secondHalf);
    const priority = getPriorityOfChar(same[0]);
    sumOfPriority += priority;
  });

  lineReader.on('close', () => {
    console.log('puzzle 1: sum of priority = ', sumOfPriority);
  });
};

const puzzle2 = (lineReader: any) => {
  var sumOfPriority = 0;

  var threeElves: string[] = [];

  lineReader.on('line', (line: string) => {
    const length = line.length;

    // const firstHalf = line.slice(0, length / 2);
    // const secondHalf = line.slice(line.length / 2, length);
    if (threeElves.length === 2) {
      threeElves.push(line);
      const sameBetweenFirstTwo = checkIfStringsContainSameCharacters(
        threeElves[0],
        threeElves[1]
      );

      const sameBetweenAll = checkIfStringsContainSameCharacters(
        sameBetweenFirstTwo,
        threeElves[2]
      );
      const priority = getPriorityOfChar(sameBetweenAll);
      sumOfPriority += priority;
      threeElves = [];
    } else {
      threeElves.push(line);
    }
  });

  lineReader.on('close', () => {
    console.log('puzzle 2: sum of priority = ', sumOfPriority);
  });
};

const checkIfStringsContainSameCharacters = (
  string1: string,
  string2: string
) => {
  let duplicateCharacter = '';
  for (let i = 0; i < string1.length; i += 1) {
    if (duplicateCharacter.indexOf(string1[i]) === -1) {
      if (string2.indexOf(string1[i]) !== -1) {
        duplicateCharacter += string1[i];
      }
    }
  }
  return duplicateCharacter;
};

const getPriorityOfChar = (character: string): number => {
  let code: number = character.charCodeAt(0);
  if (code > 64 && code < 91) return code - 38;
  else if (code > 96 && code < 123) return code - 96;
  return 0;
};

run();
