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
import brotli from 'wasm-brotli';
import { writeFile } from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(writeFile);

const content = Buffer.from('Hello, world!', 'utf8');

(async () => {
  try {
    const compressedContent = await brotli(content);
    await writeFileAsync('./hello_world.txt.br', compressedContent);
  } catch (err) {
    console.error(err);
  }
})();
```

### Browser

An example of compressing something and downloading it from the browser.

```js
import brotli from 'wasm-brotli';

const content = new TextEncoder('utf-8').encode('Hello, world!');

(async () => {
  try {
    const compressedContent = await brotli(content);

    const file = new File([compressedContent], 'hello_world.txt.gz', { type: 'application/brotli' });

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

### brotli(data)

*   `data` [`<Uint8Array>`][mdn uint8array]

Compress `data` using Brotli compression.

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
