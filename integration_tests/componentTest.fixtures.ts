import path from 'node:path'
import { test as base } from '@playwright/test'
import { build } from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
import nunjucks from 'nunjucks'
import type {
  BlockDefinition,
  ComponentRegistryEntry,
  EvaluatedBlock,
} from '@ministryofjustice/hmpps-forge/core/components'
import { BlockType, StructureType } from '@ministryofjustice/hmpps-forge/core/authoring'

interface AssetEntryPoints {
  scripts: readonly string[]
  stylesheets: readonly string[]
}

interface CompiledAssets {
  css: string
  js: string
}

interface MountOptions {
  assets?: AssetEntryPoints
  js?: boolean
}

type ComponentProps<TBlock extends BlockDefinition> = Omit<EvaluatedBlock<TBlock>, 'type' | 'blockType' | 'variant'>

interface ComponentTestFixtures {
  mountForgeComponent: <TBlock extends BlockDefinition>(
    component: ComponentRegistryEntry<TBlock, string>,
    props: ComponentProps<TBlock>,
    options?: MountOptions,
  ) => Promise<void>
}

interface ComponentWorkerFixtures {
  compileAssets: (assetEntryPoints: AssetEntryPoints) => Promise<CompiledAssets>
}

const defaultAssetEntryPoints: AssetEntryPoints = {
  scripts: ['assets/js/index.js'],
  stylesheets: ['assets/scss/index.scss'],
}

const nunjucksEnv = nunjucks.configure(
  [
    'server/views',
    'server/forms',
    'node_modules/@ministryofjustice/hmpps-forge/dist/moj-components',
    'node_modules/govuk-frontend/dist',
    'node_modules/@ministryofjustice/frontend',
  ],
  { autoescape: true },
)

const test = base.extend<ComponentTestFixtures, ComponentWorkerFixtures>({
  compileAssets: [
    async ({}, use) => {
      const compiledAssetsByEntryPoints = new Map<string, Promise<CompiledAssets>>()

      await use(async assetEntryPoints => {
        const entryPoints = [...assetEntryPoints.stylesheets, ...assetEntryPoints.scripts].map(entryPoint =>
          path.resolve(entryPoint),
        )
        const cacheKey = entryPoints.join('\0')
        const cachedAssets = compiledAssetsByEntryPoints.get(cacheKey)

        if (cachedAssets) {
          return cachedAssets
        }

        const compiledAssets = build({
          entryPoints,
          bundle: true,
          write: false,
          outdir: path.resolve('dist'),
          platform: 'browser',
          target: 'es2018',
          external: ['/assets/*'],
          preserveSymlinks: true,
          plugins: [
            sassPlugin({
              quietDeps: true,
              silenceDeprecations: ['import'],
              loadPaths: [process.cwd(), path.resolve('node_modules')],
            }),
          ],
        }).then(result => ({
          css: result.outputFiles
            .filter(file => file.path.endsWith('.css'))
            .map(file => file.text)
            .join('\n'),
          js: result.outputFiles
            .filter(file => file.path.endsWith('.js'))
            .map(file => file.text)
            .join('\n'),
        }))

        compiledAssetsByEntryPoints.set(cacheKey, compiledAssets)

        return compiledAssets
      })
    },
    { scope: 'worker' },
  ],
  mountForgeComponent: async ({ page, compileAssets }, use) => {
    await use(
      async <TBlock extends BlockDefinition>(
        component: ComponentRegistryEntry<TBlock, string>,
        props: ComponentProps<TBlock>,
        options: MountOptions = {},
      ) => {
        const block = {
          type: StructureType.BLOCK,
          blockType: BlockType.BASIC,
          variant: component.variant,
          ...props,
        } as EvaluatedBlock<TBlock>
        const assets = await compileAssets(options.assets ?? defaultAssetEntryPoints)
        const html = await component.render(block, nunjucksEnv)

        await page.setContent(html)
        await page.addStyleTag({ content: assets.css })

        if (options.js ?? true) {
          await page.addScriptTag({ content: assets.js })
        }
      },
    )
  },
})

export default test
