import { genExports } from './getModels';

export function generateModelExports(filePath: string[]) {
  const exports = genExports(filePath);

  return exports;
}
