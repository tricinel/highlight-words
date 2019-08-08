import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const babelPlugin = babel({
  exclude: 'node_modules/**'
});

const typescriptOptions = {
  typescript: require('typescript'),
  tsconfig: './tsconfig.build.json',
  tsconfigOverride: {
    compilerOptions: {
      module: 'esnext'
    }
  }
};

const input = 'src/index.ts';

export default [
  {
    input,
    output: [
      {
        name: 'StringSplitter',
        file: `dist/_bundles/${pkg.name}.umd.js`,
        format: 'umd'
      },
      {
        name: 'StringSplitter',
        file: `dist/bundles/${pkg.name}.umd.min.js`,
        format: 'umd'
      }
    ],
    plugins: [
      resolve(),
      commonjs(),
      babelPlugin,
      typescript({
        ...typescriptOptions,
        tsconfigOverride: {
          compilerOptions: {
            declaration: false
          }
        }
      }),
      terser({
        include: [/^.+\.min\.js$/],
        sourcemap: true,
        output: { comments: false },
        compress: {
          keep_infinity: true,
          pure_getters: true,
          passes: 10
        },
        ecma: 5,
        warnings: true
      })
    ]
  },
  {
    input,
    output: [
      {
        dir: `dist/lib`,
        format: 'cjs'
      }
    ],
    plugins: [babelPlugin, typescript(typescriptOptions)]
  },
  {
    input,
    output: [
      {
        dir: `dist/lib-esm`,
        format: 'esm'
      }
    ],
    plugins: [babelPlugin, typescript(typescriptOptions)]
  }
];
