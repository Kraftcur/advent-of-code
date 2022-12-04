import readline from 'readline';
import fs from 'fs';

export function getReaderInterface(filePath: string): readline.Interface {
  return readline.createInterface({
    input: fs.createReadStream(filePath),
  });
}
