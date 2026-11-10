// Builds the browser assets into dist/assets with esbuild and dart-sass: the app
// bundle (assets/js/*.js, assets/scss/*.scss) and each form's bundle (forms/*/assets/form.{js,scss}),
// hashed, with dist/assets/manifest.json mapping each to its hashed name (the `assetMap` filter).
//
//   FORGE_MOJ_COMPONENTS_STYLES  Forge's MOJ component styles (default: the `styles` directory of the
//                                forge-moj-components crate Cargo resolved, from `cargo metadata`)
import * as esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
import manifestPlugin from 'esbuild-plugin-manifest'
import { execFileSync } from 'node:child_process'
import { cpSync, readdirSync, rmSync } from 'node:fs'
import path from 'node:path'

const cwd = path.dirname(new URL(import.meta.url).pathname)
const production = process.env.NODE_ENV === 'production'
const watch = process.argv.includes('--watch')
const outdir = path.join(cwd, 'dist/assets')

/** The forge-moj-components crate's styles, wherever Cargo checked the crate out (git dependency). */
function cargoMojStyles() {
  const metadata = JSON.parse(
    execFileSync('cargo', ['metadata', '--format-version', '1', '--manifest-path', path.join(cwd, 'Cargo.toml')], {
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    }),
  )
  const crate = metadata.packages.find(p => p.name === 'forge-moj-components')
  if (!crate) throw new Error('forge-moj-components not found in cargo metadata')
  return path.join(path.dirname(crate.manifest_path), 'styles')
}

const forgeStyles = process.env.FORGE_MOJ_COMPONENTS_STYLES ?? cargoMojStyles()

const common = {
  outdir,
  bundle: true,
  minify: production,
  sourcemap: !production,
  platform: 'browser',
  target: 'es2018',
  external: ['/assets/*'],
  plugins: [
    sassPlugin({
      quietDeps: true,
      silenceDeprecations: ['import'],
      loadPaths: [cwd, path.join(cwd, 'node_modules'), forgeStyles],
      // Forge's MOJ component styles are a partial named for the package
      importMapper: url => (url === 'forge-moj-components' ? path.join(forgeStyles, '_forge-moj-components.scss') : url),
    }),
    manifestPlugin({
      append: true,
      filename: 'manifest.json',
      generate: entries =>
        Object.fromEntries(
          Object.entries(entries).map(paths => paths.map(p => p.replace(/^.*?dist\//, '/'))),
        ),
    }),
  ],
}

/** Files under `dir` (relative to this directory) whose path matches `pattern`. */
const find = (dir, pattern) =>
  readdirSync(path.join(cwd, dir), { recursive: true })
    .map(f => path.join(cwd, dir, f))
    .filter(f => pattern.test(f))

rmSync(path.join(outdir, 'js'), { recursive: true, force: true })
rmSync(path.join(outdir, 'css'), { recursive: true, force: true })
rmSync(path.join(outdir, 'manifest.json'), { force: true })
cpSync(path.join(cwd, 'assets/images'), path.join(outdir, 'images'), { recursive: true })

const builds = [
  {
    ...common,
    entryPoints: [...find('assets/js', /\/js\/[^/]+\.js$/), ...find('assets/scss', /\/scss\/[^/]+\.scss$/)],
    entryNames: '[ext]/[name].[hash]',
  },
  {
    ...common,
    entryPoints: find('forms', /\/form\.(js|scss)$/),
    outbase: path.join(cwd, 'forms'),
    entryNames: '[ext]/forms/[dir]/[name].[hash]',
  },
]

if (watch) {
  for (const build of builds) {
    // eslint-disable-next-line no-await-in-loop
    await (await esbuild.context(build)).watch()
  }
} else {
  await Promise.all(builds.map(build => esbuild.build(build)))
}
