import { expect } from '@playwright/test'
import test from '../../../../../integration_tests/componentTest.fixtures'
import { modalComponent } from './modalComponent'

const strengthsAndNeedsAssets = {
  scripts: [
    'assets/js/index.js',
    'server/forms/strengths-and-needs/assets/form.js',
    'server/forms/strengths-and-needs/components/modal/modal.js',
  ],
  stylesheets: [
    'assets/scss/index.scss',
    'server/forms/strengths-and-needs/assets/form.scss',
    'server/forms/strengths-and-needs/components/modal/_modal.scss',
  ],
}

test.describe('Modal', () => {
  const modalDialogue = '[data-module="modal-dialogue"]'

  test('should render modal component', async ({ page, mountForgeComponent }) => {
    await mountForgeComponent(
      modalComponent,
      { id: '1', title: 'Are you sure you want to delete?', buttonText: 'Delete' },
      { assets: strengthsAndNeedsAssets, js: true },
    )

    // eslint-disable-next-line no-return-assign
    await page.$eval(modalDialogue, el => (el.style.display = 'flex'))
    await expect(page.getByRole('dialog')).toBeVisible()

    await expect(page.getByRole('dialog')).toHaveAccessibleName('Delete')
    await expect(page.getByTestId('overlay')).toBeVisible()
    await expect(page.getByText('Are you sure you want to')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Delete' })).toHaveClass(/govuk-button--warning/)
    await expect(page.getByRole('link', { name: 'Cancel' })).toBeVisible()
  })

  test('should be accessible', async ({ page, mountForgeComponent, makeAxeBuilder }) => {
    await mountForgeComponent(
      modalComponent,
      { id: '1', title: 'Are you sure you want to delete?', buttonText: 'Delete' },
      { assets: strengthsAndNeedsAssets, js: true },
    )

    // eslint-disable-next-line no-return-assign
    await page.$eval(modalDialogue, el => (el.style.display = 'flex'))
    await expect(page.getByRole('dialog')).toBeVisible()

    const accessibilityScanResults = await makeAxeBuilder()
      .include(modalDialogue)
      .analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })
})
