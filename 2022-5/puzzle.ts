import { getReaderInterface } from '../file';

// Test the function
const startingStacks = [
  'NBDTVGZJ',
  'SRMDWPF',
  'VCRSZ',
  'RTJZPHG',
  'TCJNDZQF',
  'NVPWGSFM',
  'GCVBPQ',
  'ZBPN',
  'WPJ',
];

const run = () => {
  var lineReader = getReaderInterface('./2022-5/input.txt');

  puzzle(lineReader);
};

function puzzle(lineReader: any): void {
  let output: string[];
  let steps: string[] = [];
  lineReader.on('line', (line: string) => {
    steps.push(line);
  });

  lineReader.on('close', () => {
    output = findTopCrates(startingStacks, steps);
    console.log('Answer: ', output);
  });
}

function findTopCrates(crateStacks: string[], steps: string[]): string[] {
  // Create an array to store the current stack of crates
  const stacks: string[][] = crateStacks.map((crateStack) =>
    crateStack.split('')
  );

  // Loop through the steps of the rearrangement procedure
  for (const step of steps) {
    // Parse the step to get the source and destination stack indices
    const stuff = step.match(/^move (\d*) from (\d*) to (\d*)$/);

    if (stuff) {
      let destinationStackIndex = stuff[3];
      let sourceStackIndex = stuff[2];
      let amountToMove = stuff[1];

      // Get the source and destination stacks
      const sourceStack = stacks[Number(sourceStackIndex) - 1];
      const destinationStack = stacks[Number(destinationStackIndex) - 1];

      console.log('sourceStack', sourceStack);
      const cratesMoving = sourceStack.splice(
        sourceStack.length - Number(amountToMove)
      );

      console.log('cratesMoving', cratesMoving);
      console.log('destinationStack', destinationStackIndex);
      if (cratesMoving) {
        destinationStack.push(...cratesMoving);
      }
      console.log('new destinationStack', destinationStack);

      console.log('\n');
      // // Move the top crate from the source stack to the destination stack
      // for (let i = 0; i < Number(amountToMove); i++) {
      //   const movedCrate = sourceStack.pop();
      //   if (movedCrate) {
      //     destinationStack.push(movedCrate);
      //   }
      // }
    }
  }

  // Return the top crates from each stack
  return stacks.map((stack) => stack[stack.length - 1]);
}

run();
