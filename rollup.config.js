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
      sourcemap: 'inline', // Use inline source maps for CDN compatibility
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
      sourcemap: false, // Disable source maps for minified version
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
      sourcemap: 'inline' // Use inline source maps for CDN compatibility
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
      sourcemap: 'inline', // Use inline source maps for CDN compatibility
      exports: 'named'
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json'
      })
    ]
  }
];
