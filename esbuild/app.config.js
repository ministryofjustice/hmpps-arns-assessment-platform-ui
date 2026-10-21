const path = require('node:path')
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
  // Rehearsal: tsconfig path aliases aren't applied inside node_modules, so the installed
  // Sentence Plan package needs this to find the SDK.
  alias: { '@ministryofjustice/hmpps-aap-sdk': path.join(process.cwd(), 'packages/aap-sdk/src') },
  // Installed journey source must use Forge JSX even without a packaged tsconfig (as on Tom's #822 branch).
  jsx: 'automatic',
  jsxImportSource: '@ministryofjustice/hmpps-forge/jsx-components',
  sourcemap: true,
  platform: 'node',
  format: 'cjs',
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  loader: {
    '.njk': 'empty',
  },
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
