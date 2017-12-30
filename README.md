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

*   `buffer` [`<Uint8Array>`][mdn uint8array]

Compress `buffer` using Brotli compression.

### decompress(buffer)

*   `buffer` [`<Uint8Array>`][mdn uint8array]

Decompress `buffer` using Brotli decompression.

### brotli(method, buffer)

*   `method` `<BROTLI_COMPRESS>` | `<BROTLI_DECOMPRESS>`
*   `buffer` [`<Uint8Array>`][mdn uint8array]

The function that `compress` and `decompress` wrap. Pass any of the constants
below and a buffer to compress or decompress.

### BROTLI_COMPRESS

Constant, reference, for compressing a buffer with `brotli`.

### BROTLI_DECOMPRESS

Constant, reference, for decompressing a buffer with `brotli`.

[mdn uint8array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array

## Benchmark

Want to see how fast this is? [Go to the benchmark directory][benchmark] to see
results, instructions on running your own benchmark, and more.

[benchmark]: https://github.com/dfrankland/wasm-brotli/tree/master/benchmark

## Development

To build `wasm-brotli` you will need to [install Docker][docker install], and
pull [`rustlang/rust:nightly`][rust nightly]. After that all that is needed is
to do the following:

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

[docker install]: https://docs.docker.com/engine/installation/
[rust nightly]: https://hub.docker.com/r/rustlang/rust/
