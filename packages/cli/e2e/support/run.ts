import { spawn } from 'child_process';
import concat from 'concat-stream';

export const run = (command: string): Promise<string> => {
  const process = spawn('yarn', ['bgs', command]);
  process.stdin.setDefaultEncoding('utf8');
  return new Promise((resolve, reject) => {
    process.stderr.once('data', err => reject(err.toString()));
    process.on('error', reject);
    process.stdout.pipe(concat(out => resolve(out.toString())));
  });
};
