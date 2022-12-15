import { getReaderInterface } from '../file';
import { inspect } from 'util';

const run = () => {
  var lineReader = getReaderInterface('./2022-7/input.txt');

  puzzle(lineReader);
};

type Command = 'cd' | 'ls';
type CDAction = '..' | '/' | string;

type File = {
  name: string;
  size: number;
};

class Directory {
  parentDirectory: Directory | null;
  name: string;
  size: number;
  files: Map<string, File>;
  directories: Map<string, Directory>;

  constructor(name: string, parentDirectory: Directory | null) {
    this.name = name;
    this.files = new Map<string, File>();
    this.directories = new Map<string, Directory>();
    this.parentDirectory = parentDirectory;
    this.size = 0;
  }

  executeCommand(command: Command, action: CDAction | null): Directory {
    switch (command) {
      case 'cd':
        return this.cdDirectory(action ? action : '');
      case 'ls':
        return this;
    }
  }

  addDirectory(name: string): void {
    this.directories.set(name, new Directory(name, this));
  }

  addFile(name: string, size: number): void {
    this.files.set(name, { name, size });
    this.addSize(size);
  }

  addSize(size: number) {
    this.size += size;
    if (this.parentDirectory) {
      this.parentDirectory.addSize(size);
    }
  }

  getParentDirectory(): Directory {
    return this.parentDirectory ?? this;
  }

  goToRootDirectory(): Directory {
    let parentDirectory = this.parentDirectory;
    if (parentDirectory === null) {
      return this;
    }
    return parentDirectory.goToRootDirectory();
  }

  goToOrCreateDirectory(name: CDAction): Directory {
    return this.directories.has(name)
      ? this.directories.get(name)!
      : new Directory(name, this);
  }

  cdDirectory(action: CDAction): Directory {
    switch (action) {
      case '..':
        return this.getParentDirectory();
      case '/':
        return this.goToRootDirectory();
      case '':
        return this;
      default:
        return this.goToOrCreateDirectory(action);
    }
  }

  getTotalSize(size?: number): number {
    let totalSize = 0;

    if (size === undefined || this.size <= size) {
      totalSize = this.size;
    }

    for (const [, directory] of this.directories) {
      totalSize += directory.getTotalSize(size);
    }

    return totalSize;
  }

  getDirectorysWithSizeGreaterThan(
    size: number,
    dirs: Map<string, Directory>
  ): number[] {
    let smallestNeeded: number[] = [];

    for (const [, directory] of dirs) {
      if (directory.size >= size) {
        console.log(directory.size);
        smallestNeeded.push(directory.size);
      }
      smallestNeeded.concat(
        directory.getDirectorysWithSizeGreaterThan(size, directory.directories)
      );
    }

    return smallestNeeded;
  }
}

const numberRegex = /^\d*$/;

function puzzle(lineReader: any): void {
  let currentDirectory = new Directory('/', null);
  lineReader.on('line', (line: string) => {
    let inputArray = line.split(' ');
    if (inputArray[0] === '$') {
      currentDirectory = currentDirectory.executeCommand(
        inputArray[1] as Command,
        inputArray[2]
      );
    } else {
      if (numberRegex.test(inputArray[0])) {
        currentDirectory.addFile(inputArray[1], parseInt(inputArray[0]));
      } else {
        currentDirectory.addDirectory(inputArray[1]);
      }
    }
  });

  lineReader.on('close', () => {
    // console.log(curr/entDirectory);
    currentDirectory = currentDirectory.goToRootDirectory();
    // console.log(inspect(currentDirectory));
    let totalSpace = 70000000;
    let updateSize = 30000000;
    let totalUsedSpace = currentDirectory.size;
    console.log(totalUsedSpace);

    let unusedSpace = totalSpace - totalUsedSpace;
    let spaceNeededToFree = updateSize - unusedSpace;

    console.log(spaceNeededToFree);
    let dirOptions = currentDirectory.getDirectorysWithSizeGreaterThan(
      spaceNeededToFree,
      currentDirectory.directories
    );

    console.log(dirOptions);
  });
}

run();
