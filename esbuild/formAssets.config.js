const { sassPlugin } = require('esbuild-sass-plugin')
const manifestPlugin = require('esbuild-plugin-manifest')
const { buildNotificationPlugin } = require('./utils')

/**
 * Build form-specific scss and javascript assets
 *
 * Package manifests supply named entry points so their source can live either
 * in the platform or in an installed journey package. Output is namespaced by
 * the root journey code:
 *   dist/assets/js/forms/{form-name}/form.[hash].js
 *   dist/assets/css/forms/{form-name}/form.[hash].css
 */
const getFormAssetsConfig = buildConfig => {
  // Skip if no form assets found
  if (buildConfig.formAssets.entryPoints.length === 0) {
    return null
  }

  return {
    entryPoints: buildConfig.formAssets.entryPoints,
    outdir: buildConfig.formAssets.outDir,
    entryNames: '[ext]/forms/[dir]/[name].[hash]',
    minify: buildConfig.isProduction,
    sourcemap: !buildConfig.isProduction,
    platform: 'browser',
    target: 'es2018',
    external: ['/assets/*'],
    bundle: true,
    plugins: [
      sassPlugin({
        quietDeps: true,
        silenceDeprecations: ['import'],
        loadPaths: buildConfig.formAssets.loadPaths,
      }),
      manifestPlugin({
        append: true,
        generate: entries =>
          Object.fromEntries(Object.entries(entries).map(paths => paths.map(p => p.replace(/^dist\//, '/')))),
      }),
      buildNotificationPlugin('Form Assets', buildConfig.isWatchMode),
    ],
  }
}

module.exports = { getFormAssetsConfig }
