import { expect } from '@playwright/test'
import type { BlockDefinition, EvaluatedBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { nunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import test from '../../../../../../integration_tests/componentTest.fixtures'

const strengthsAndNeedsAssets = {
  scripts: ['assets/js/index.js', 'server/forms/strengths-and-needs/assets/form.js'],
  stylesheets: [
    'assets/scss/index.scss',
    'server/forms/strengths-and-needs/assets/form.scss',
    'server/forms/strengths-and-needs/assets/print-cover-page/_print-cover-page.scss',
  ],
}

test.describe('Print Header', () => {
  test('should render strengths and needs sensitive print header', async ({ page, mountForgeComponent }) => {
    // Act
    await mountForgeComponent(
      nunjucksComponent<BlockDefinition>('printHeader', {
        render: (_props, nunjucksEnv) => {
          return nunjucksEnv.render('strengths-and-needs/views/components/print-header/index.njk')
        },
      }),
      {} as EvaluatedBlock<BlockDefinition>,
      { assets: strengthsAndNeedsAssets, js: true },
    )

    await page.emulateMedia({ media: 'print' })

    // Assert
    await expect(page.getByTestId('header-logo')).toBeVisible()
    await expect(page.getByTestId('header-logo').getByTestId('moj-header-crest')).toHaveCSS('color', 'rgb(0, 0, 0)')
    await expect(page.getByTestId('header-title').getByText('Ministry of Justice')).toBeVisible()
    await expect(page.getByTestId('header-title').getByText('Strengths and needs')).toBeVisible()

    await expect(page.getByTestId('header-tag')).toBeVisible()
    await expect(page.getByTestId('header-tag').getByText('Official Sensitive')).toHaveClass(/govuk-tag--red/)
  })
})
