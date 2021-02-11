import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

import pkg from './package.json';

const pkgName = pkg.name
  .split('-')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join('');

function pathForBuild(format, production) {
  const ext = `${production ? '.min' : ''}.${format === 'dts' ? 'd.ts' : 'js'}`;
  switch (format) {
    case 'umd':
      return `dist/bundles/${pkg.name}${ext}`;
    case 'es':
      return `dist/lib-esm/${pkg.name}${ext}`;
    case 'dts':
      return `dist/${pkg.name}${ext}`;

    // cjs
    default:
      return `dist/lib/${pkg.name}${ext}`;
  }
}

function bundle(format, production) {
  return {
    input: 'src/index.ts',
    output: {
      name: pkgName,
      file: pathForBuild(format, production),
      format,
      sourcemap: format !== 'dts',
      exports: format === 'cjs' ? 'named' : 'default'
    },
    plugins: format === 'dts' ? [dts()] : [esbuild({ minify: production })],
    external: (id) => !/^[./]/.test(id)
  };
}

const bundles = [
  bundle('dts'),
  bundle('es'),
  bundle('cjs'),
  bundle('umd'),
  bundle('es', true),
  bundle('cjs', true),
  bundle('umd', true)
];

export default bundles;
