import merge from 'deepmerge';
import { createBasicConfig } from '@open-wc/building-rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const baseConfig = createBasicConfig();

export default merge(baseConfig, {
  input: 'src/oklch-color-wheel.ts',
  plugins: [
    nodeResolve({
      extensions: ['.js', '.ts'],
      moduleDirectories: ['node_modules']
    }),
    typescript({
      sourceMap: true
    })
  ],
  output: {
    dir: 'dist',
    sourcemap: true,
    format: 'es'
  }
});
