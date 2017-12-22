import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import docker from 'rollup-plugin-docker';
import wasmModule from 'rollup-plugin-wasm-module';
import replace from 'rollup-plugin-replace';
import { resolve as resolvePath, dirname } from 'path';
import { dependencies } from './package.json';

const HOST = '/host';
const DIST = '/dist';

const baseConfig = ({
  output,
  targets,
  external,
  replacers,
  runtimeHelpers,
}) => ({
  input: './src/index.js',
  output,
  plugins: [
    nodeResolve(),
    commonjs({
      namedExports: {
        'node_modules/kaffeerost/index.js': ['wrap'],
      },
    }),
    ...(replacers ? [null] : []).map(() => (
      replace(replacers)
    )),
    ...(targets ? [null] : []).map(() => (
      babel({
        include: ['./src/**/*.js'],
        babelrc: false,
        runtimeHelpers,
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false,
              targets,
            },
          ],
          '@babel/preset-stage-0',
        ],
        plugins: (runtimeHelpers ? [null] : []).map((
          () => '@babel/plugin-transform-runtime'
        )),
      })
    )),
    docker({
      include: ['**/Cargo.toml'],
      options: {
        image: 'rustlang/rust:nightly',
        createOptions: {
          Binds: [`/:${HOST}`],
        },
        command: path => [
          'sh',
          '-c',
          `
            rustup target add wasm32-unknown-unknown \
            && \
            mkdir ${DIST} \
            && \
            cd ${resolvePath(HOST, `.${dirname(path)}`)} \
            && \
            CARGO_TARGET_DIR=${DIST} \
              cargo build \
                --release \
                --target wasm32-unknown-unknown
          `,
        ],
        paths: {
          main: resolvePath(DIST, './wasm32-unknown-unknown/release/wasm-brotli.wasm'),
        },
      },
    }),
    wasmModule({
      include: ['**/Cargo.toml'],
    }),
  ],
  external,
});

export default [
  baseConfig({
    output: {
      file: './dist/index.mjs',
      format: 'es',
    },
    external: Object.keys(dependencies),
  }),
  baseConfig({
    output: {
      file: './dist/index.js',
      format: 'cjs',
    },
    targets: {
      node: '8',
    },
    external: Object.keys(dependencies),
  }),
  baseConfig({
    output: {
      file: './dist/browser.js',
      format: 'umd',
      name: 'wasmBrotli',
      globals: {
        'text-encoding': 'window',
      },
    },
    // https://caniuse.com/#feat=wasm
    targets: {
      edge: '16',
      firefox: '52',
      chrome: '57',
      safari: '11',
      ios: '11.2',
      android: '62',
    },
    external: ['text-encoding'],
    replacers: {
      'process.env': '(typeof process === \'object\' && typeof process.env === \'object\' ? process.env : {})',
    },
    runtimeHelpers: true,
  }),
].filter((
  process.env.TARGET ? (
    ({ output: { format } }) => process.env.TARGET === format
  ) : (
    () => true
  )
));
