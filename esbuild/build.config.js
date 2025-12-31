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
      entryPoints: [path.join(cwd, 'server.ts'), 'server/**/*.njk', 'packages/**/*.njk'],
      copy: [
        {
          from: path.join(cwd, 'server/**/*.njk'),
          to: path.join(cwd, 'dist/server'),
          watch: isWatchMode,
        },
        {
          from: path.join(cwd, 'packages/**/*.njk'),
          to: path.join(cwd, 'dist/packages'),
          watch: isWatchMode,
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

    formAssets: {
      outDir: path.join(cwd, 'dist/assets'),
      outbase: path.join(cwd, 'server/forms'),
      entryPoints: globSync([path.join(cwd, 'server/forms/**/form.js'), path.join(cwd, 'server/forms/**/form.scss')]),
    },
  }
}

module.exports = { getBuildConfig }
