import { expect } from '@playwright/test'
import { BlockType, StructureType } from '@ministryofjustice/hmpps-forge/core/authoring'
import type { EvaluatedBlock } from '@ministryofjustice/hmpps-forge/core/components'
import test from '../../../../../integration_tests/componentTest.fixtures'
import { TabPanel } from './tabPanel'

const trainingSessionLauncherAssets = {
  scripts: ['assets/js/index.js', 'server/forms/training-session-launcher/assets/form.js'],
  stylesheets: ['assets/scss/index.scss', 'server/forms/training-session-launcher/assets/form.scss'],
}

const tabPanelItems: EvaluatedBlock<TabPanel>['items'] = [
  {
    id: 'first-scenario',
    label: 'First scenario',
    sublabel: 'London',
    panel: [
      {
        block: {
          type: StructureType.BLOCK,
          blockType: BlockType.BASIC,
          variant: 'html',
        },
        html: '<h3>First scenario details</h3>',
      },
    ],
  },
  {
    id: 'second-scenario',
    label: 'Second scenario',
    sublabel: 'Manchester',
    panel: [
      {
        block: {
          type: StructureType.BLOCK,
          blockType: BlockType.BASIC,
          variant: 'html',
        },
        html: '<h3>Second scenario details</h3>',
      },
    ],
  },
]

test.describe('TabPanel', () => {
  test('should render the selected panel when JavaScript does not run', async ({ page, mountForgeComponent }) => {
    // Act
    await mountForgeComponent(
      TabPanel,
      { id: 'scenarios', items: tabPanelItems, defaultSelected: 'second-scenario' },
      { assets: trainingSessionLauncherAssets, js: false },
    )

    // Assert
    await expect(page.getByRole('tab', { name: /Second scenario/ })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tabpanel', { name: /Second scenario/ })).toBeVisible()
    await expect(page.getByRole('tabpanel', { name: /First scenario/ })).toBeHidden()
  })

  test('should select a panel when its tab is clicked', async ({ page, mountForgeComponent }) => {
    // Arrange
    await mountForgeComponent(
      TabPanel,
      { id: 'scenarios', items: tabPanelItems },
      { assets: trainingSessionLauncherAssets },
    )

    const secondTab = page.getByRole('tab', { name: /Second scenario/ })

    // Act
    await secondTab.click()

    // Assert
    await expect(secondTab).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tabpanel', { name: /Second scenario/ })).toBeVisible()
    await expect(page.getByRole('tabpanel', { name: /First scenario/ })).toBeHidden()
  })

  test('should move between tabs with the arrow keys', async ({ page, mountForgeComponent }) => {
    // Arrange
    await mountForgeComponent(
      TabPanel,
      { id: 'scenarios', items: tabPanelItems },
      { assets: trainingSessionLauncherAssets },
    )

    const firstTab = page.getByRole('tab', { name: /First scenario/ })
    const secondTab = page.getByRole('tab', { name: /Second scenario/ })

    // Act
    await firstTab.focus()
    await firstTab.press('ArrowLeft')

    // Assert
    await expect(secondTab).toBeFocused()
    await expect(secondTab).toHaveAttribute('aria-selected', 'true')
  })

  test('should apply the pointer cursor when the stylesheet is loaded', async ({ page, mountForgeComponent }) => {
    // Arrange
    await mountForgeComponent(
      TabPanel,
      { id: 'scenarios', items: tabPanelItems },
      { assets: trainingSessionLauncherAssets },
    )

    // Act
    const cursor = await page.getByRole('tab', { name: /First scenario/ }).evaluate(element => {
      return element.ownerDocument.defaultView?.getComputedStyle(element).cursor
    })

    // Assert
    expect(cursor).toBe('pointer')
  })
})
