import { writeFileSync } from 'fs';
import { resolve as resolvePath } from 'path';
import packageJson from './pkg/package.json';

packageJson.browser = 'wasm_brotli_browser.js';

writeFileSync(
  resolvePath(__dirname, './pkg/package.json'),
  JSON.stringify(packageJson, null, '  '),
);
