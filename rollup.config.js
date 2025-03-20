import merge from 'deepmerge';
import { createBasicConfig } from '@open-wc/building-rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const baseConfig = createBasicConfig({
  nodeResolve: {
    moduleDirectories: ['node_modules'],
    extensions: ['.js', '.ts']
  }
});

export default merge(baseConfig, {
  input: 'src/oklch-color-wheel.ts',
  plugins: [
    typescript({
      sourceMap: true
    })
  ],
  output: {
    dir: 'dist',
    entryFileNames: '[name]-[hash].js',
    sourcemap: true,
    format: 'es'
  }
});
