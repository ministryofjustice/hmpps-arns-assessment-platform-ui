import { expect } from '@playwright/test'
import { VersionsTable } from '@server/interfaces/coordinator-api/previousVersions'
import { test, TargetService } from '../../../support/fixtures'
import { navigateToStrengthsAndNeeds, formatOrdinalDate, v1Path, previousVersions, sanFormPath } from '../sanUtils'
import PreviousVersionsPage from '../../../pages/strengthsAndNeeds/previousVersionsPage'
import coordinatorApi from '../../../mockApis/coordinatorApi'

test.describe('Previous Versions - Countersigned', () => {
  test.only('should show countersigned versions from previous days in a separate table', async ({
    page,
    createSession,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    const today = new Date()
    const yesterday = new Date()

    yesterday.setDate(today.getDate() - 1)

    const countersignedVersions: VersionsTable = {
      [`${today.toISOString().split('T')[0]}`]: {
        description: 'Assessment and plan updated',
        assessmentVersion: {
          uuid: crypto.randomUUID(),
          version: 3,
          createdAt: today.toISOString(),
          updatedAt: today.toISOString(),
          status: 'COUNTERSIGNED',
          planAgreementStatus: '',
          entityType: 'AAP_SAN',
        },
        planVersion: {
          uuid: crypto.randomUUID(),
          version: today.getTime(),
          createdAt: today.toISOString(),
          updatedAt: today.toISOString(),
          status: 'COUNTERSIGNED',
          planAgreementStatus: '',
          entityType: 'AAP_PLAN',
        },
      },
      [`${yesterday.toISOString().split('T')[0]}`]: {
        description: 'Assessment and plan updated',
        assessmentVersion: {
          uuid: crypto.randomUUID(),
          version: 2,
          createdAt: yesterday.toISOString(),
          updatedAt: yesterday.toISOString(),
          status: 'COUNTERSIGNED',
          planAgreementStatus: '',
          entityType: 'AAP_SAN',
        },
        planVersion: {
          uuid: crypto.randomUUID(),
          version: yesterday.getTime(),
          createdAt: yesterday.toISOString(),
          updatedAt: yesterday.toISOString(),
          status: 'COUNTERSIGNED',
          planAgreementStatus: '',
          entityType: 'AAP_PLAN',
        },
      },
    }

    await coordinatorApi.stubGetEntityVersions(sanAssessmentId, {
      allVersions: {
        [`${yesterday.toISOString().split('T')[0]}`]: {
          description: 'Plan updated',
          assessmentVersion: null,
          planVersion: {
            uuid: crypto.randomUUID(),
            version: yesterday.getTime(),
            createdAt: yesterday.toISOString(),
            updatedAt: yesterday.toISOString(),
            status: 'UNSIGNED',
            planAgreementStatus: 'AGREED',
            entityType: 'AAP_PLAN',
          },
        },
        ...countersignedVersions,
      },
      countersignedVersions,
      unaggregatedVersions: [],
    })

    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(`${baseURL}${sanFormPath}${v1Path}/edit/${sanAssessmentId}/current${previousVersions}`)
    const previousVersionsPage = await PreviousVersionsPage.verifyOnPage(page, 'Previous versions')
    const todaysDate = formatOrdinalDate(today)
    const yesterdaysDate = formatOrdinalDate(yesterday)

    // Verify both previous versions tables are shown
    expect(previousVersionsPage.mainForm).toMatchAriaSnapshot(`
      - paragraph: Check versions of Test's current assessment. The links will open in a new tab.
      - table "Countersigned versions":
        - caption: Countersigned versions
        - rowgroup:
          - row "Date Assessment Plan":
            - columnheader "Date"
            - columnheader "Assessment"
            - columnheader "Plan"
        - rowgroup:
          - row "${todaysDate} Assessment and plan updated View assessment from ${todaysDate} View sentence plan from ${todaysDate}":
            - cell "${todaysDate} Assessment and plan updated":
              - paragraph: ${todaysDate}
              - paragraph: Assessment and plan updated
            - cell "View assessment from ${todaysDate}":
              - paragraph:
                - link "View assessment from ${todaysDate}":
                  - /url: /\\/strengths-and-needs\\/v1\\.0\\/view-historic\\/.*/
            - cell "View sentence plan from ${todaysDate}":
              - paragraph:
                - link "View sentence plan from ${todaysDate}":
                  - /url: /\\/sentence-plan\\/v1\\.0\\/plan\\/view-historic\\/\\d+.*/
          - row "${yesterdaysDate} Assessment and plan updated View assessment from ${yesterdaysDate} View sentence plan from ${yesterdaysDate}":
            - cell "${yesterdaysDate} Assessment and plan updated":
              - paragraph: ${yesterdaysDate}
              - paragraph: Assessment and plan updated
            - cell "View assessment from ${yesterdaysDate}":
              - paragraph:
                - link "View assessment from ${yesterdaysDate}":
                  - /url: /\\/strengths-and-needs\\/v1\\.0\\/view-historic\\/.*/
            - cell "View sentence plan from ${yesterdaysDate}":
              - paragraph:
                - link "View sentence plan from ${yesterdaysDate}":
                  - /url: /\\/sentence-plan\\/v1\\.0\\/plan\\/view-historic\\/\\d+.*/
      - table "All versions":
        - caption: All versions
        - rowgroup:
          - row "Date Assessment Plan":
            - columnheader "Date"
            - columnheader "Assessment"
            - columnheader "Plan"
        - rowgroup:
          - row "${todaysDate} Assessment and plan updated View assessment from ${todaysDate} View sentence plan from ${todaysDate}":
            - cell "${todaysDate} Assessment and plan updated":
              - paragraph: ${todaysDate}
              - paragraph: Assessment and plan updated
            - cell "View assessment from ${todaysDate}":
              - paragraph:
                - link "View assessment from ${todaysDate}":
                  - /url: /\\/strengths-and-needs\\/v1\\.0\\/view-historic\\/.*/
            - cell "View sentence plan from ${todaysDate}":
              - paragraph:
                - link "View sentence plan from ${todaysDate}":
                  - /url: /\\/sentence-plan\\/v1\\.0\\/plan\\/view-historic\\/\\d+.*/
          - row "${yesterdaysDate} Assessment and plan updated View assessment from ${yesterdaysDate} View sentence plan from ${yesterdaysDate}":
            - cell "${yesterdaysDate} Assessment and plan updated":
              - paragraph: ${yesterdaysDate}
              - paragraph: Assessment and plan updated
            - cell "View assessment from ${yesterdaysDate}":
              - paragraph:
                - link "View assessment from ${yesterdaysDate}":
                  - /url: /\\/strengths-and-needs\\/v1\\.0\\/view-historic\\/.*/
            - cell "View sentence plan from ${yesterdaysDate}":
              - paragraph:
                - link "View sentence plan from ${yesterdaysDate}":
                  - /url: /\\/sentence-plan\\/v1\\.0\\/plan\\/view-historic\\/\\d+.*/
      - paragraph:
        - link "↑ Back to top":
          - /url: "#main-content"
    `)

  })
})
