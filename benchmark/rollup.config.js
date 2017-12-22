import babel from 'rollup-plugin-babel';
import { dependencies } from './package.json';

export default {
  input: './src/index.js',
  output: {
    file: './dist/index.js',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    babel({
      include: ['**/*.js'],
      babelrc: false,
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: {
              node: 'current',
            },
          },
        ],
        '@babel/preset-stage-0',
      ],
    }),
  ],
  external: [
    ...Object.keys(dependencies),
    'util',
    'crypto',
  ],
};
