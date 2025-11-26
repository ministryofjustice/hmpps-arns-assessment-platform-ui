const path = require('path')
const { globSync } = require('node:fs')

/**
 * Configuration for build steps
 */
const getBuildConfig = () => {
  const cwd = process.cwd()
  const isProduction = process.env.NODE_ENV === 'production'
  const isWatchMode = process.argv.includes('--watch')

  return {
    isProduction,
    isWatchMode,

    app: {
      outDir: path.join(cwd, 'dist'),
      entryPoints: path.join(cwd, 'server.ts'),
      copy: [
        {
          from: path.join(cwd, 'server/**/*.njk'),
          to: path.join(cwd, 'dist/server'),
        },
        {
          from: path.join(cwd, 'packages/**/*.njk'),
          to: path.join(cwd, 'dist/packages'),
        },
      ],
    },

    assets: {
      outDir: path.join(cwd, 'dist/assets'),
      entryPoints: globSync([path.join(cwd, 'assets/js/*.js'), path.join(cwd, 'assets/scss/*.scss')]),
      copy: [
        {
          from: path.join(cwd, 'assets/images/**/*'),
          to: path.join(cwd, 'dist/assets/images'),
        },
      ],
      clear: globSync([path.join(cwd, 'dist/assets/{css,js}')]),
    },
  }
}

module.exports = { getBuildConfig }
