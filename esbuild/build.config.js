const path = require('path')
const { globSync } = require('node:fs')

/**
 * Configuration for build steps
 */
// Rehearsal: Sentence Plan is installed as a package that ships its TypeScript, templates and assets as source.
const SENTENCE_PLAN_SOURCE = 'node_modules/@ministryofjustice/hmpps-arns-sentence-plan/src'

const getBuildConfig = () => {
  const cwd = process.cwd()
  const isProduction = process.env.NODE_ENV === 'production'
  const isWatchMode = process.argv.includes('--watch')

  return {
    isProduction,
    isWatchMode,

    app: {
      outDir: path.join(cwd, 'dist'),
      entryPoints: [path.join(cwd, 'server.ts'), 'server/**/*.njk'],
      copy: [
        {
          from: path.join(cwd, 'server/**/*.njk'),
          to: path.join(cwd, 'dist/server'),
          watch: isWatchMode,
        },
        // Copied under forms/sentence-plan so templates keep their existing names, e.g. 'sentence-plan/views/...'
        {
          from: path.join(cwd, SENTENCE_PLAN_SOURCE, '**/*.njk'),
          to: path.join(cwd, 'dist/server/forms/sentence-plan'),
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
      entryPoints: [
        ...globSync([path.join(cwd, 'server/forms/**/form.js'), path.join(cwd, 'server/forms/**/form.scss')]).map(
          file => ({ in: file, out: path.relative(path.join(cwd, 'server/forms'), file).replace(/\.(js|scss)$/, '') }),
        ),
        // Built to the same paths as when Sentence Plan lived in server/forms/sentence-plan
        { in: path.join(cwd, SENTENCE_PLAN_SOURCE, 'assets/form.js'), out: 'sentence-plan/assets/form' },
        { in: path.join(cwd, SENTENCE_PLAN_SOURCE, 'assets/form.scss'), out: 'sentence-plan/assets/form' },
      ],
    },
  }
}

module.exports = { getBuildConfig }
