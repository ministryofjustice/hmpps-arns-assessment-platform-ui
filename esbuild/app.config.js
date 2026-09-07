const { copy } = require('esbuild-plugin-copy')
const { typecheckPlugin } = require('@jgoz/esbuild-plugin-typecheck')
const { globSync } = require('node:fs')
const { buildNotificationPlugin } = require('./utils')
const pkg = require('../package.json')

/**
 * Build typescript application into CommonJS
 */
const getAppConfig = (buildConfig, aapPackageManifestPlugin) => ({
  entryPoints: globSync(buildConfig.app.entryPoints),
  outdir: buildConfig.app.outDir,
  bundle: true,
  sourcemap: true,
  platform: 'node',
  format: 'cjs',
  // Installed journey source must use Forge JSX even without a packaged tsconfig.
  jsx: 'automatic',
  jsxImportSource: '@ministryofjustice/hmpps-forge/jsx-components',
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  loader: {
    '.njk': 'empty',
  },
  plugins: [
    aapPackageManifestPlugin.create(),
    buildConfig.isAssembly
      ? undefined
      : typecheckPlugin({
          watch: buildConfig.isWatchMode,
        }),
    copy({
      resolveFrom: 'cwd',
      assets: buildConfig.app.copy,
    }),
    buildNotificationPlugin('App', buildConfig.isWatchMode),
  ].filter(Boolean),
})

module.exports = { getAppConfig }
