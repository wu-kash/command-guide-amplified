import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export default [
  // UMD build for browsers
  {
    input: 'src/copy-guide-widget.ts',
    output: {
      file: 'dist/copy-guide-widget.js',
      format: 'umd',
      name: 'CopyGuideWidget',
      sourcemap: true
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json'
      })
    ]
  },
  // UMD minified build
  {
    input: 'src/copy-guide-widget.ts',
    output: {
      file: 'dist/copy-guide-widget.min.js',
      format: 'umd',
      name: 'CopyGuideWidget',
      sourcemap: true
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json'
      }),
      terser()
    ]
  },
  // ES module build
  {
    input: 'src/copy-guide-widget.ts',
    output: {
      file: 'dist/copy-guide-widget.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json'
      })
    ]
  },
  // CommonJS build
  {
    input: 'src/copy-guide-widget.ts',
    output: {
      file: 'dist/copy-guide-widget.cjs.js',
      format: 'cjs',
      sourcemap: true
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json'
      })
    ]
  }
];
