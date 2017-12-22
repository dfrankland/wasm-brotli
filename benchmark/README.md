# wasm-brotli-benchmark

A simple benchmark that runs a warmup using random bytes, then generates random
bytes for a series of modules to compress using brotli.

The current modules that this tests are:

*   [`iltorb`][iltorb]: A Node.js native addon brotli library.

*   [`wasm-brotli`][wasm-brotli]: A Rust WebAssembly `rust-unknown-unknown`-
    compiled brotli library.

[iltorb]: https://github.com/MayhemYDG/iltorb
[wasm-brotli]: https://github.com/dfrankland/wasm-brotli

## To Run

1.  Build `wasm-brotli` if you haven't already done so&mdash;
    [see instructions here][build].

[build]: https://github.com/dfrankland/wasm-brotli#development

2.  Install all dependencies.

```bash
npm install
```

3.  Build and run the benchmark.

```bash
npm run benchmark
```

4.  Wait a while... The tests might run quite slow.

## Results

These results are run on a MacBook Pro (Retina, 15-inch, Mid 2015) with a
2.2 GHz Intel Core i7 processor and 16 GB 1600 MHz DDR3 memory, running macOS
High Sierra version 10.13.2:

```
## payload size: 1
iltorb (native compress) x 2,135 ops/sec ±3.96% (69 runs sampled)
wasm-brotli (rust wasm compress) x 4.92 ops/sec ±3.33% (28 runs sampled)
Fastest is iltorb (native compress)

## payload size: 1024
iltorb (native compress) x 251 ops/sec ±0.94% (76 runs sampled)
wasm-brotli (rust wasm compress) x 4.93 ops/sec ±2.28% (28 runs sampled)
Fastest is iltorb (native compress)

## payload size: 1038336
iltorb (native compress) x 1.55 ops/sec ±1.70% (12 runs sampled)
wasm-brotli (rust wasm compress) x 1.81 ops/sec ±1.78% (13 runs sampled)
Fastest is wasm-brotli (rust wasm compress)
```
