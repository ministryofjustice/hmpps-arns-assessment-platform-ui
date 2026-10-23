import { expect } from '@playwright/test'
import { StructureType } from '@ministryofjustice/hmpps-forge/core/authoring'
import test from '../../../../../integration_tests/componentTest.fixtures'
import { PreviousVersions } from './previousVersions'
import { PreviousVersionsResponse, VersionDetails } from '../../../../interfaces/coordinator-api/previousVersions'

const serverAssets = {
  scripts: ['assets/js/index.js'],
  stylesheets: [
    'assets/scss/index.scss',
    'server/forms/sentence-plan/components/previous-versions/_previous-versions.scss',
  ],
}

test.describe('previous versions', () => {
  test('renders no previous versions', async ({ page, mountForgeComponent }) => {
    await mountForgeComponent(
      PreviousVersions,
      {
        personName: 'Test',
        previousVersions: {
          allVersions: {},
          countersignedVersions: {},
        },
      },
      { assets: serverAssets, js: true },
    )

    expect(page.getByText("There are no previous versions of Test's assessment and plan yet.")).toBeVisible()
  })

  test('renders multiple unsigned previous versions', async ({ page, mountForgeComponent }) => {
    const today = new Date()
    const yesterday = new Date()
    const twoDaysAgo = new Date()

    yesterday.setDate(today.getDate() - 1)
    twoDaysAgo.setDate(today.getDate() - 2)

    const toDateKey = (d: Date) => d.toISOString().split('T')[0]

    const unsignedBlock = {
      type: StructureType.BLOCK,
      personName: 'Test',
      previousVersions: {
        allVersions: {
          [toDateKey(yesterday)]: {
            description: 'Assessment and plan updated',
            assessmentVersion: {
              uuid: crypto.randomUUID(),
              version: yesterday.getTime(),
              createdAt: yesterday.toISOString(),
              updatedAt: yesterday.toISOString(),
              status: 'UNSIGNED',
              planAgreementStatus: '',
              entityType: 'ASSESSMENT',
            } as VersionDetails,
            planVersion: {
              uuid: crypto.randomUUID(),
              version: yesterday.getTime(),
              createdAt: yesterday.toISOString(),
              updatedAt: yesterday.toISOString(),
              status: 'UNSIGNED',
              planAgreementStatus: 'AGREED',
              entityType: 'AAP_PLAN',
            } as VersionDetails,
          },
          [toDateKey(twoDaysAgo)]: {
            description: 'Plan updated',
            assessmentVersion: null,
            planVersion: {
              uuid: crypto.randomUUID(),
              version: twoDaysAgo.getTime(),
              createdAt: twoDaysAgo.toISOString(),
              updatedAt: twoDaysAgo.toISOString(),
              status: 'UNSIGNED',
              planAgreementStatus: 'AGREED',
              entityType: 'AAP_PLAN',
            } as VersionDetails,
          },
        },
        countersignedVersions: {},
      } as PreviousVersionsResponse,
    }

    await mountForgeComponent(PreviousVersions, { ...unsignedBlock }, { assets: serverAssets, js: true })

    // Previous versions table
    const table = page.getByTestId('previous-versions-table')
    expect(table).toBeVisible()

    // Table populated with non-countersigned data
    expect(
      page.getByText("Check versions of Test's current assessment and plan. The links will open in a new tab."),
    ).toBeVisible()
    expect(page.getByText('Assessment and plan updated')).toBeVisible()
    expect(page.getByText(/Plan updated/)).toBeVisible()
    expect(page.getByText('Plan agreed')).toBeVisible()
    expect(page.getByText('Plan agreed')).toHaveClass(/govuk-tag--blue/)
    expect(table).not.toHaveClass('govuk-table__caption--m')

    // Row details
    expect(page.getByRole('columnheader', { name: 'Date and what was updated' })).toBeVisible()
    expect(page.getByRole('columnheader', { name: 'Assessment' })).toBeVisible()
    expect(page.getByRole('columnheader', { name: 'Sentence plan' })).toBeVisible()
    expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible()

    await expect(page.getByTestId('assessment-link')).toHaveAttribute('target', '_blank')
    await expect(page.getByTestId('plan-link').first()).toHaveAttribute('target', '_blank')

    const yesterdayRegex = new RegExp(
      `${yesterday.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`,
    )
    await expect(page.getByRole('row', { name: yesterdayRegex })).toBeVisible()
    const twoDaysAgoRegex = new RegExp(
      `${yesterday.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`,
    )
    await expect(page.getByRole('row', { name: twoDaysAgoRegex })).toBeVisible()
  })
})
