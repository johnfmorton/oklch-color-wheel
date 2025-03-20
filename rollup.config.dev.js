// rollup.config.dev.js
import merge from 'deepmerge';
import { createBasicConfig } from '@open-wc/building-rollup';
import typescript from '@rollup/plugin-typescript';

const baseConfig = createBasicConfig();

export default merge(baseConfig, {
  input: 'src/oklch-color-wheel.ts',
  output: {
    dir: 'dist',
    // no [hash] in dev
    entryFileNames: '[name].js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    typescript({
      sourceMap: true,
    }),
  ],
});
