/* global WebAssembly */

import { wrap } from 'kaffeerost';
import brotliWasmModule from './brotli/Cargo.toml';

export const BROTLI_COMPRESS = {};
export const BROTLI_DECOMPRESS = {};

const methods = new Map([
  [BROTLI_COMPRESS, 'compress'],
  [BROTLI_DECOMPRESS, 'decompress'],
]);

export const brotli = async (method, data) => {
  if (!methods.has(method)) throw new Error('method is invalid');
  if (!(data instanceof Uint8Array)) throw new Error('data must be a Uint8Array');

  const {
    instance: {
      exports,
    } = {},
  } = await brotliWasmModule({
    env: {
      memory: new WebAssembly.Memory({ initial: 4096, limit: 4096 }),
      // log: x => Math.log(x), Maybe not needed?
      log2f: x => Math.log2(x),
    },
  });

  const brotliMethod = wrap(
    exports,
    methods.get(method),
    ['&[u8]'],
    'Vec<u8>',
  );

  return brotliMethod(data);
};

export const compress = (...args) => brotli(BROTLI_COMPRESS, ...args);
export const decompress = (...args) => brotli(BROTLI_DECOMPRESS, ...args);
