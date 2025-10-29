const { copy } = require('esbuild-plugin-copy')
const { typecheckPlugin } = require('@jgoz/esbuild-plugin-typecheck')
const { globSync } = require('node:fs')
const { buildNotificationPlugin } = require('./utils')
const pkg = require('../package.json')

/**
 * Build typescript application into CommonJS
 */
const getAppConfig = buildConfig => ({
  entryPoints: globSync(buildConfig.app.entryPoints),
  outdir: buildConfig.app.outDir,
  bundle: true,
  sourcemap: true,
  platform: 'node',
  format: 'cjs',
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    typecheckPlugin({
      watch: buildConfig.isWatchMode,
    }),
    copy({
      resolveFrom: 'cwd',
      assets: buildConfig.app.copy,
    }),
    buildNotificationPlugin('App', buildConfig.isWatchMode),
  ],
})

module.exports = { getAppConfig }
