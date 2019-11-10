# wasm-brotli

WebAssembly compiled Brotli library.

## Installation

```bash
npm install -S wasm-brotli
```

> The awesome thing about `wasm-brotli` is that it does not need to compile or
> download any prebuilt binaries!

## Usage

Because WebAssembly is supported on both Node.js and several browsers,
`wasm-brotli` is super easy to use.

### Node.js

An example of compressing something and saving it to a file via Node.js.

```js
import { compress } from 'wasm-brotli';
import { writeFile } from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(writeFile);

const content = Buffer.from('Hello, world!', 'utf8');

(async () => {
  try {
    const compressedContent = await compress(content);
    await writeFileAsync('./hello_world.txt.br', compressedContent);
  } catch (err) {
    console.error(err);
  }
})();
```

### Browser

An example of compressing something and downloading it from the browser.

```js
import { compress } from 'wasm-brotli';

const content = new TextEncoder('utf-8').encode('Hello, world!');

(async () => {
  try {
    const compressedContent = await compress(content);

    const file = new File([compressedContent], 'hello_world.txt.br', { type: 'application/brotli' });

    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(file));
    link.setAttribute('download', file.name);
    link.click();
  } catch (err) {
    console.error(err);
  }
})();
```

## Documentation

### compress(buffer)

*   `buffer` [`<Uint8Array>`][]

Compress `buffer` using Brotli compression.

### decompress(buffer)

*   `buffer` [`<Uint8Array>`][]

Decompress `buffer` using Brotli decompression.

[`<Uint8Array>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array

## Development

To build `wasm-brotli` you will need to install [`wasm-pack`][]. After that all
that is needed is to do the following:

1.  Install all dependencies.

    ```bash
    npm install
    ```

2.  Build the module.

    ```bash
    npm run build
    ```

3.  Test the module.

    ```bash
    npm test
    ```

[`wasm-pack`]: https://rustwasm.github.io/wasm-pack/

## Benchmark

1.  Build `wasm-brotli` if you haven't already done so&mdash;
    [see instructions here][].

2.  Build and run the benchmark.

    ```bash
    npm run benchmark
    ```

3.  Wait a while... The tests might run quite slow.

[see instructions here]: https://github.com/dfrankland/wasm-brotli#development

These results are run on a Dell XPS 13 9360 with an Intel® Core™ i7-7500U CPU @
2.70GHz × 4 and 16 GB 1866 MHz DDR3 memory, running Ubuntu 19.10:

```
iltorb (native compress)      1 byte(s)  x 5,159 ops/sec ±9.73% (66 runs sampled)
wasm-brotli (wasm compress)   1 byte(s)  x 49.80 ops/sec ±0.61% (78 runs sampled)
iltorb (native compress)      1024 byte(s)       x 329 ops/sec ±1.63% (81 runs sampled)
wasm-brotli (wasm compress)   1024 byte(s)       x 32.33 ops/sec ±0.77% (76 runs sampled)
iltorb (native compress)      1038336 byte(s)    x 2.23 ops/sec ±1.20% (15 runs sampled)
wasm-brotli (wasm compress)   1038336 byte(s)    x 1.03 ops/sec ±0.93% (10 runs sampled)
```
