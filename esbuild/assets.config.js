const path = require('node:path')
const { copy } = require('esbuild-plugin-copy')
const { sassPlugin } = require('esbuild-sass-plugin')
const { clean } = require('esbuild-plugin-clean')
const manifestPlugin = require('esbuild-plugin-manifest')
const { globSync } = require('node:fs')
const { buildNotificationPlugin } = require('./utils')

/**
 * Build scss and javascript assets
 */
const getAssetsConfig = buildConfig => ({
  entryPoints: buildConfig.assets.entryPoints,
  outdir: buildConfig.assets.outDir,
  entryNames: '[ext]/[name].[hash]',
  minify: buildConfig.isProduction,
  sourcemap: !buildConfig.isProduction,
  platform: 'browser',
  target: 'es2018',
  external: ['/assets/*'],
  bundle: true,
  plugins: [
    clean({
      patterns: globSync(buildConfig.assets.clear),
    }),
    manifestPlugin({
      append: true,
      generate: entries =>
        Object.fromEntries(Object.entries(entries).map(paths => paths.map(p => p.replace(/^dist\//, '/')))),
    }),
    sassPlugin({
      quietDeps: true,
      loadPaths: [process.cwd(), path.join(process.cwd(), 'node_modules')],
    }),
    copy({
      resolveFrom: 'cwd',
      assets: buildConfig.assets.copy,
    }),
    buildNotificationPlugin('Assets', buildConfig.isWatchMode),
  ],
})

module.exports = { getAssetsConfig }
