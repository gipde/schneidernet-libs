import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'
import { terser } from 'rollup-plugin-terser'

export default [
  // CommonJS and ES module build.
  {
    input: 'src/index.ts',
    external: ['date-fns', 'date-fns/locale', 'chalk', 'loglevel'],
    plugins: [
      // nodeResolve(), // include node_modulse deps
      commonjs(), // convert to es modules
      typescript({ jsx: 'react' }), // so Rollup can convert TypeScript to JavaScript
      // terser(),
    ],
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true },
    ],
  },
]
