import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export default [
  // UMD build for browsers
  {
    input: 'src/command-guide-amplified.ts',
    output: {
      file: 'dist/command-guide-amplified.js',
      format: 'umd',
      name: 'CommandGuideAmplifiedWidget',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json'
      })
    ]
  },
  // UMD minified build
  {
    input: 'src/command-guide-amplified.ts',
    output: {
      file: 'dist/command-guide-amplified.min.js',
      format: 'umd',
      name: 'CommandGuideAmplifiedWidget',
      sourcemap: true,
      exports: 'named'
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
    input: 'src/command-guide-amplified.ts',
    output: {
      file: 'dist/command-guide-amplified.esm.js',
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
    input: 'src/command-guide-amplified.ts',
    output: {
      file: 'dist/command-guide-amplified.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json'
      })
    ]
  }
];
