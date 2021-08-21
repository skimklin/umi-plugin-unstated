import { readdirSync } from 'fs';
import { join } from 'path';

export default {
  target: 'node',
  cjs: { type: 'babel', lazy: true },
  disableTypeCheck: true,
};
