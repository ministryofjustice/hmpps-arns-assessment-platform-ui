const esbuild = require('esbuild')
const { styleText } = require('node:util')
const { emojis } = require('./utils')
const { getAppConfig } = require('./app.config')
const { getAssetsConfig } = require('./assets.config')
const { getFormAssetsConfig } = require('./formAssets.config')
const { getBuildConfig } = require('./build.config')

/**
 * Run ESBuild process, if `--watch` provided, run in watch mode.
 */
async function main() {
  const buildConfig = getBuildConfig()
  const appConfig = getAppConfig(buildConfig)
  const assetsConfig = getAssetsConfig(buildConfig)
  const formAssetsConfig = getFormAssetsConfig(buildConfig)

  // Collect all configs, filtering out null (e.g., no form assets found)
  const allConfigs = [appConfig, assetsConfig, formAssetsConfig].filter(Boolean)

  // Create ESBuild contexts with watch mode conditional on isWatchMode
  if (buildConfig.isWatchMode) {
    process.stderr.write(`${styleText('bold', `${emojis.eyes} Starting ESBuild watchers...`)}\n`)

    return Promise.all(
      allConfigs.map(async config => {
        const ctx = await esbuild.context(config)
        await ctx.watch()
      }),
    )
  }

  // Run ESBuild in standard build mode
  process.stderr.write(`${styleText('bold', `${emojis.cog} Starting ESBuild...`)}\n`)

  return Promise.all(allConfigs.map(config => esbuild.build(config))).catch(e => {
    process.stderr.write(`${e}\n`)
    process.exit(1)
  })
}

main()
