const path = require('path')
const { globSync, statSync } = require('node:fs')

/**
 * Configuration for build steps
 */
const getBuildConfig = aapPackages => {
  const cwd = process.cwd()
  const isProduction = process.env.NODE_ENV === 'production'
  const isWatchMode = process.argv.includes('--watch')
  const isAssembly = process.argv.includes('--assembly')
  const packageTemplateCopies = aapPackages.flatMap(({ directory, name, resources }) =>
    (resources.templates || []).map(templatePattern => ({
      from: path.join(directory, templatePattern),
      to: path.join(cwd, 'dist/server/forms', name),
      watch: isWatchMode,
    })),
  )
  const packageAssetEntryPoints = aapPackages.flatMap(({ directory, name, resources }) =>
    ((resources.assets || {}).entryPoints || []).map(entryPoint => ({
      in: path.join(directory, entryPoint),
      out: path.join(name, entryPoint.slice(0, -path.extname(entryPoint).length)),
    })),
  )
  const packageStaticCopies = aapPackages.flatMap(({ directory, name, resources }) =>
    ((resources.assets || {}).staticFiles || []).flatMap(staticPattern =>
      globSync(path.join(directory, staticPattern))
        .filter(staticPath => statSync(staticPath).isFile())
        .map(staticFile => ({
          from: staticFile,
          to: path.join(cwd, 'dist/assets/forms', name, path.relative(directory, staticFile)),
          watch: isWatchMode,
        })),
    ),
  )

  return {
    isAssembly,
    isProduction,
    isWatchMode,

    app: {
      outDir: path.join(cwd, 'dist'),
      entryPoints: [path.join(cwd, 'server.ts')],
      copy: [
        {
          from: path.join(cwd, 'server/views/**/*.njk'),
          to: path.join(cwd, 'dist/server/views'),
          watch: isWatchMode,
        },
        ...packageTemplateCopies,
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
        ...packageStaticCopies,
      ],
      clear: globSync([path.join(cwd, 'dist/assets/{css,js}')]),
    },

    formAssets: {
      outDir: path.join(cwd, 'dist/assets'),
      entryPoints: packageAssetEntryPoints,
      loadPaths: [
        cwd,
        path.join(cwd, 'node_modules'),
        ...aapPackages.map(({ packageDirectory }) => path.join(packageDirectory, 'node_modules')),
      ],
    },
  }
}

module.exports = { getBuildConfig }
