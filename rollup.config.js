import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import pkg from './package.json'
import { terser } from 'rollup-plugin-terser'

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.ts',
    output: {
      name: 'tools',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true,
      compact: true,
      plugins: [terser()],
      globals: { os: 'require$$0', tty: 'require$$1' },
    },
    plugins: [
      nodeResolve(), // include node_modulse deps
      commonjs(), // convert to es modules
      nodePolyfills(), // Node.js Polyfill
      typescript(), // so Rollup can convert TypeScript to JavaScript
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'src/index.ts',
    external: ['date-fns', 'date-fns/locale', 'chalk', 'loglevel'],
    plugins: [
      typescript(), // so Rollup can convert TypeScript to JavaScript
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  },
]
