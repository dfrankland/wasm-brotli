/* global WebAssembly */

import { stringToPointer, pointerToString } from './cString';
import utf8Decoder from './utf8Decoder';
import brotliWasmModule from './brotli/Cargo.toml';

export const BROTLI_COMPRESS = {};
export const BROTLI_DECOMPRESS = {};

const methods = new Map([
  [BROTLI_COMPRESS, 'compress'],
  [BROTLI_DECOMPRESS, 'decompress'],
]);

export const brotli = async (method, buffer) => {
  if (!methods.has(method)) throw new Error('method is invalid');
  if (!(buffer instanceof Uint8Array)) throw new Error('buffer must be a Uint8Array');

  return new Promise(async (resolve, reject) => {
    try {
      const {
        instance: {
          exports,
        } = {},
      } = await brotliWasmModule({
        env: {
          memory: new WebAssembly.Memory({ initial: 0, limit: 4096 }),
          log2f: x => Math.log2(x),
          js_resolve: (ptr, len) => {
            const result = pointerToString({ exports, ptr, len });
            exports.dealloc(ptr, len);
            resolve(result);
          },
          js_reject: (ptr, len) => {
            const err = utf8Decoder(pointerToString({ exports, ptr, len }));
            exports.dealloc(ptr, len);
            reject(new Error(err));
          },
          js_console_log: (ptr, len) => {
            const log = utf8Decoder(pointerToString({ exports, ptr, len }));
            console.log(log); // eslint-disable-line no-console
          },
        },
      });

      const { [methods.get(method)]: brotliMethod } = exports;

      const { ptr, len } = stringToPointer({ exports, buffer });

      brotliMethod(ptr, len);
    } catch (err) {
      reject(err);
    }
  });
};

export const compress = (...args) => brotli(BROTLI_COMPRESS, ...args);
export const decompress = (...args) => brotli(BROTLI_DECOMPRESS, ...args);
