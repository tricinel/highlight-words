import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type LibraryFormats } from 'vite';

interface PackageJson {
  name: string;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
) as PackageJson;

const pkgName = pkg.name;

export default defineConfig(() => {
  const minify = process.env.MINIFY === 'true';

  return {
    publicDir: false,
    resolve: {
      tsconfigPaths: true
    },
    build: {
      target: 'es2020',
      outDir: 'dist',
      emptyOutDir: !minify,
      sourcemap: minify,
      minify,
      lib: {
        entry: { [pkgName]: 'src/index.ts' },
        formats: ['es', 'cjs'] satisfies LibraryFormats[],
        fileName: (_format, entryName) => {
          const format = _format as 'es' | 'cjs';
          const ext = format === 'es' ? 'mjs' : 'js';
          return `${entryName}${minify ? '.min' : ''}.${ext}`;
        }
      },
      rolldownOptions: {
        external: (id) => !/^[./]/.test(id),
        output: {
          exports: 'named'
        }
      }
    },
    test: {
      include: ['./__tests__/src/*.test.ts']
    }
  };
});
