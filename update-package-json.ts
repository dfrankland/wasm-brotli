import { writeFileSync } from 'fs';
import { resolve as resolvePath } from 'path';
import glob from 'glob';
import packageJson from './pkg/package.json';

const pkgDir = resolvePath(__dirname, 'pkg');

packageJson.browser = 'wasm_brotli_browser.js';

packageJson.files = glob.sync('*.+(js|ts|wasm)', { cwd: pkgDir });

writeFileSync(
  resolvePath(pkgDir, 'package.json'),
  JSON.stringify(packageJson, null, '  '),
);
