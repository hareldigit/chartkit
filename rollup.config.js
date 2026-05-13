import terser from '@rollup/plugin-terser';

const banner = `/*!
 * ChartKit v1.0.0
 * Pure JavaScript charting library
 * MIT License
 */`;

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/chartkit.js',
      format: 'iife',
      name: 'ChartKit',
      banner,
      exports: 'named',
    },
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/chartkit.min.js',
      format: 'iife',
      name: 'ChartKit',
      banner,
      sourcemap: true,
      exports: 'named',
    },
    plugins: [terser()],
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/chartkit.esm.js',
      format: 'es',
      banner,
    },
  },
];
