import { globSync } from 'node:fs'
import { builtinModules } from 'node:module'
import path from 'node:path'
/* eslint-disable import/no-extraneous-dependencies */
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { dts } from 'rollup-plugin-dts'
/* eslint-enable import/no-extraneous-dependencies */
import pkg from './package.json'

const sourceFiles = globSync(['src/**/*.ts', 'src/**/*.mjs']).filter(file => !file.endsWith('.test.ts'))
const input = Object.fromEntries(sourceFiles.map(file => [path.relative('src', file).replace(/\.(ts|mjs)$/, ''), file]))
const dependencies = [...Object.keys(pkg.dependencies), ...builtinModules]
const external = [/^node:/, ...dependencies.flatMap(dependency => [dependency, new RegExp(`^${dependency}/`)])]
const declarationInput = Object.fromEntries(
  sourceFiles.map(file => [
    path.relative('src', file).replace(/\.(ts|mjs)$/, ''),
    path.join(
      'dist/declarations',
      path.relative('src', file).replace(/\.(ts|mjs)$/, extension => (extension === '.mjs' ? '.d.mts' : '.d.ts')),
    ),
  ]),
)

export default [
  {
    input,
    output: [
      {
        dir: 'dist',
        entryFileNames: 'cjs/[name].cjs',
        chunkFileNames: 'cjs/shared/[name]-[hash].cjs',
        format: 'cjs',
        sourcemap: true,
      },
      {
        dir: 'dist',
        entryFileNames: 'esm/[name].mjs',
        chunkFileNames: 'esm/shared/[name]-[hash].mjs',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      typescript({ tsconfig: './tsconfig.build.json', noEmitOnError: true }),
    ],
    external,
  },
  {
    input: declarationInput,
    output: [
      { dir: 'dist/cjs', entryFileNames: '[name].d.cts', chunkFileNames: 'shared/[name]-[hash].d.cts', format: 'esm' },
      { dir: 'dist/esm', entryFileNames: '[name].d.mts', chunkFileNames: 'shared/[name]-[hash].d.mts', format: 'esm' },
    ],
    plugins: [dts()],
    external,
  },
]
