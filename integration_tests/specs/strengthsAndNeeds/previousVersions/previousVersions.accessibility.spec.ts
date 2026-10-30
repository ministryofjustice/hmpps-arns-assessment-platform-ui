import { VersionsTable } from '@server/interfaces/coordinator-api/previousVersions'
import { test, TargetService } from '../../../support/fixtures'
import { navigateToStrengthsAndNeeds, checkAccessibility, previousVersions, v1Path, sanFormPath } from '../sanUtils'
import PreviousVersionsPage from '../../../pages/strengthsAndNeeds/previousVersionsPage'
import coordinatorApi from '../../../mockApis/coordinatorApi'

test.describe('Accessibility', () => {
  test('should be accessibile', async ({ page, createSession, baseURL }) => {
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
    await PreviousVersionsPage.verifyOnPage(page, 'Previous versions')
    await checkAccessibility(page, { include: '#main-content' })

  })
})
