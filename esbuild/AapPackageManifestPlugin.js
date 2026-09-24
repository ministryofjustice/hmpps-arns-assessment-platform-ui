const esbuild = require('esbuild')
const path = require('node:path')
const { existsSync, readFileSync, readdirSync, realpathSync, statSync } = require('node:fs')
const { createRequire } = require('node:module')
const { compileFunction } = require('node:vm')
const platformPackage = require('../package.json')

const AAP_PACKAGE_MANIFEST_MODULE = 'aap:package-manifests'
const AAP_PACKAGE_MANIFEST_NAMESPACE = 'aap-package-manifests'

class AapPackageManifestPlugin {
  constructor(formsDirectory = path.resolve('server/forms'), nodeModulesDirectory = path.resolve('node_modules')) {
    this.formsDirectory = formsDirectory
    this.nodeModulesDirectory = nodeModulesDirectory
  }

  create() {
    return {
      name: AAP_PACKAGE_MANIFEST_NAMESPACE,
      setup: build => {
        build.onResolve({ filter: /^aap:package-manifests$/ }, () => ({
          path: AAP_PACKAGE_MANIFEST_MODULE,
          namespace: AAP_PACKAGE_MANIFEST_NAMESPACE,
        }))

        build.onLoad({ filter: /.*/, namespace: AAP_PACKAGE_MANIFEST_NAMESPACE }, () => this.loadRuntimeModule())
      },
    }
  }

  async loadResources() {
    const aapPackages = this.findAapPackages()

    if (aapPackages.length === 0) {
      return []
    }

    const buildResult = await esbuild.build({
      absWorkingDir: process.cwd(),
      bundle: true,
      external: [
        ...Object.keys(platformPackage.dependencies || {}),
        ...Object.keys(platformPackage.peerDependencies || {}),
      ],
      format: 'cjs',
      jsx: 'automatic',
      jsxImportSource: '@ministryofjustice/hmpps-forge/jsx-components',
      logLevel: 'silent',
      platform: 'node',
      stdin: {
        contents: this.createBuildModule(aapPackages),
        loader: 'ts',
        resolveDir: this.formsDirectory,
        sourcefile: 'aap-package-resources.ts',
      },
      target: 'node24',
      tsconfig: path.resolve('tsconfig.json'),
      write: false,
    })
    const loadedPackages = this.executeBuildModule(buildResult.outputFiles[0].text)
    const packageNames = loadedPackages.map(({ manifest }) => manifest.getJourneyCode())

    this.assertUniquePackageNames(packageNames)

    return loadedPackages.map(({ directory, packageDirectory, manifest }) => ({
      directory,
      packageDirectory,
      name: manifest.getJourneyCode(),
      resources: manifest.getResources(),
    }))
  }

  loadRuntimeModule() {
    const aapPackages = this.findAapPackages()
    const imports = aapPackages.map(
      ({ manifestPath }, index) => `import aapPackageManifest${index} from ${JSON.stringify(manifestPath)}`,
    )
    const manifestNames = aapPackages.map((_, index) => `aapPackageManifest${index}`)

    return {
      contents: [...imports, `export const aapPackageManifests = [${manifestNames.join(', ')}]`].join('\n'),
      loader: 'ts',
      resolveDir: this.formsDirectory,
      watchDirs: [this.formsDirectory],
      watchFiles: aapPackages.map(({ manifestPath }) => manifestPath),
    }
  }

  findAapPackages() {
    return [...this.findPlatformPackages(), ...this.findInstalledPackages()].sort((left, right) =>
      left.manifestPath.localeCompare(right.manifestPath),
    )
  }

  findPlatformPackages() {
    return readdirSync(this.formsDirectory)
      .map(name => path.join(this.formsDirectory, name))
      .filter(candidatePath => statSync(candidatePath).isDirectory())
      .map(packageDirectory => ({
        manifestPath: this.getPlatformManifestPath(packageDirectory),
        packageDirectory: path.resolve('.'),
      }))
  }

  findInstalledPackages() {
    if (!existsSync(this.nodeModulesDirectory)) {
      return []
    }

    return this.findInstalledPackageDirectories()
      .map(packageDirectory => this.readInstalledPackage(packageDirectory))
      .filter(aapPackage => aapPackage !== undefined)
  }

  findInstalledPackageDirectories() {
    return (
      readdirSync(this.nodeModulesDirectory)
        .filter(name => !name.startsWith('.'))
        .flatMap(name => {
          const packageDirectory = path.join(this.nodeModulesDirectory, name)

          if (!this.isDirectory(packageDirectory)) {
            return []
          }

          if (!name.startsWith('@')) {
            return [packageDirectory]
          }

          return readdirSync(packageDirectory)
            .map(packageName => path.join(packageDirectory, packageName))
            .filter(candidatePath => this.isDirectory(candidatePath))
        })
    )
  }

  readInstalledPackage(packageDirectory) {
    const packageJsonPath = path.join(packageDirectory, 'package.json')

    if (!existsSync(packageJsonPath)) {
      return undefined
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

    if (packageJson.aap === undefined) {
      return undefined
    }

    if (
      typeof packageJson.aap !== 'object' ||
      packageJson.aap === null ||
      typeof packageJson.aap.manifest !== 'string'
    ) {
      throw new Error(`AAP package must declare a string aap.manifest: ${packageJsonPath}`)
    }

    const realPackageDirectory = realpathSync(packageDirectory)
    const manifestPath = path.resolve(realPackageDirectory, packageJson.aap.manifest)
    const relativeManifestPath = path.relative(realPackageDirectory, manifestPath)

    if (relativeManifestPath.startsWith('..') || path.isAbsolute(relativeManifestPath)) {
      throw new Error(`AAP package manifest must be inside its package: ${packageJsonPath}`)
    }

    if (!existsSync(manifestPath)) {
      throw new Error(`AAP package manifest does not exist: ${manifestPath}`)
    }

    return { manifestPath, packageDirectory: realPackageDirectory }
  }

  getPlatformManifestPath(packageDirectory) {
    const manifestPath = path.join(packageDirectory, 'manifest.ts')

    if (!existsSync(manifestPath)) {
      throw new Error(`AAP package directory must contain manifest.ts: ${packageDirectory}`)
    }

    return manifestPath
  }

  createBuildModule(aapPackages) {
    const imports = aapPackages.map(
      ({ manifestPath }, index) => `import aapPackageManifest${index} from ${JSON.stringify(manifestPath)}`,
    )
    const packages = aapPackages.map(
      ({ manifestPath, packageDirectory }, index) =>
        `{ directory: ${JSON.stringify(path.dirname(manifestPath))}, packageDirectory: ${JSON.stringify(packageDirectory)}, manifest: aapPackageManifest${index} }`,
    )

    return [...imports, `export const loadedPackages = [${packages.join(', ')}]`].join('\n')
  }

  executeBuildModule(source) {
    const filename = path.join(this.formsDirectory, '.aap-package-resources.cjs')
    const compiledModule = { exports: {} }
    const execute = compileFunction(source, ['require', 'module', 'exports', '__filename', '__dirname'], { filename })

    execute(createRequire(filename), compiledModule, compiledModule.exports, filename, this.formsDirectory)

    return compiledModule.exports.loadedPackages
  }

  assertUniquePackageNames(packageNames) {
    const duplicatePackageName = packageNames.find((name, index) => packageNames.indexOf(name) !== index)

    if (duplicatePackageName !== undefined) {
      throw new Error(`Multiple AAP packages use the journey code: ${duplicatePackageName}`)
    }
  }

  isDirectory(candidatePath) {
    return existsSync(candidatePath) && statSync(candidatePath).isDirectory()
  }
}

module.exports = { AAP_PACKAGE_MANIFEST_MODULE, AapPackageManifestPlugin }
