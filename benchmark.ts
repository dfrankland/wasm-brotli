/* eslint-disable no-console */

import { randomBytes } from 'crypto';
import { Suite, Event } from 'benchmark';

import { compress as compressNative } from 'iltorb';
import { compress as compressWasm } from './pkg';

// warmup
compressNative(randomBytes(1024 * 1024));
compressWasm(randomBytes(1024 * 1024));

[1, 1024, 1024 * 1014]
  .reduce((acc, size): Suite => {
    const bytes = randomBytes(size);

    acc.add(`iltorb (native compress)\t${size} byte(s)\t`, {
      defer: true,
      fn: async (deffered: { resolve: Function }): Promise<void> => {
        await compressNative(bytes);
        deffered.resolve();
      },
    });

    acc.add(`wasm-brotli (wasm compress)\t${size} byte(s)\t`, {
      defer: true,
      fn: async (deffered: { resolve: Function }): Promise<void> => {
        compressWasm(bytes);
        deffered.resolve();
      },
    });

    return acc;
  }, new Suite())
  .on('cycle', (event: Event): void => {
    console.log(`${event.target}`);
  })
  .run();
