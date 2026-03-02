import { expect } from '@playwright/test'
import type { CriminogenicNeedsData } from '@server/interfaces/handover-api/shared'
import { test } from '../../../support/fixtures'
import AboutPage from '../../../pages/sentencePlan/aboutPage'
import { navigateToAboutPage } from '../sentencePlanUtils'
import coordinatorApi from '../../../mockApis/coordinatorApi'
import { createAssessmentData } from '../../../builders/AssessmentDataFactories'

const defaultCriminogenicNeedsData: CriminogenicNeedsData = {
  accommodation: {
    accLinkedToHarm: 'YES',
    accLinkedToReoffending: 'YES',
    accStrengths: 'NO',
    accOtherWeightedScore: '4',
  },
  educationTrainingEmployability: {
    eteLinkedToHarm: 'NO',
    eteLinkedToReoffending: 'YES',
    eteStrengths: 'NO',
    eteOtherWeightedScore: '2',
  },
  drugMisuse: {
    drugLinkedToHarm: 'YES',
    drugLinkedToReoffending: 'YES',
    drugStrengths: 'NO',
    drugOtherWeightedScore: '3',
  },
  alcoholMisuse: {
    alcoholLinkedToHarm: 'YES',
    alcoholLinkedToReoffending: 'NO',
    alcoholStrengths: 'NO',
    alcoholOtherWeightedScore: '3',
  },
  personalRelationshipsAndCommunity: {
    relLinkedToHarm: 'NO',
    relLinkedToReoffending: 'NO',
    relStrengths: 'YES',
    relOtherWeightedScore: '0',
  },
  thinkingBehaviourAndAttitudes: {
    thinkLinkedToHarm: 'YES',
    thinkLinkedToReoffending: 'YES',
    thinkStrengths: 'NO',
    thinkOtherWeightedScore: '4',
  },
}

const addClientIdToHandoverLink = (handoverLink: string): string => {
  const url = new URL(handoverLink)
  url.searchParams.set('clientId', 'sentence-plan')
  return url.toString()
}

test.describe('About Page: error states', () => {
  test.describe('Missing NDelius sentence information only', () => {
    test('displays sentence warning and hides table but shows assessment areas', async ({
      page,
      coordinatorBuilder,
      handoverBuilder,
      sentencePlanBuilder,
    }) => {
      const association = await coordinatorBuilder.create().withCrn('NOTFOUND').save()
      const session = await handoverBuilder
        .forAssociation(association)
        .withCriminogenicNeeds(defaultCriminogenicNeedsData)
        .save()

      await sentencePlanBuilder.extend(association.sentencePlanId).save()
      await coordinatorApi.stubGetEntityAssessment(association.sentencePlanId, {
        sanAssessmentData: createAssessmentData('complete'),
      })

      await navigateToAboutPage(page, addClientIdToHandoverLink(session.handoverLink))

      const aboutPage = await AboutPage.verifyOnPage(page)

      await expect(aboutPage.noSentenceInfoWarning).toBeVisible()
      await expect(aboutPage.noSentenceInfoWarning).toContainText(
        'There is a problem getting the sentence information from NDelius',
      )
      await expect(aboutPage.sentenceTable).not.toBeVisible()
      await expect(aboutPage.noAssessmentDataWarning).not.toBeVisible()

      await expect(aboutPage.highScoringAreasHeading).toBeVisible()
      await expect(aboutPage.lowScoringAreasHeading).toBeVisible()
      await expect(aboutPage.otherAreasHeading).toBeVisible()
    })
  })

  test.describe('Missing assessment information only', () => {
    test('displays assessment warning and hides area sections but shows sentence table', async ({
      page,
      coordinatorBuilder,
      handoverBuilder,
      sentencePlanBuilder,
    }) => {
      const association = await coordinatorBuilder.create().save()
      const session = await handoverBuilder.forAssociation(association).save()

      await sentencePlanBuilder.extend(association.sentencePlanId).save()
      await coordinatorApi.stubGetEntityAssessmentNotFound(association.sentencePlanId)

      await navigateToAboutPage(page, addClientIdToHandoverLink(session.handoverLink))

      const aboutPage = await AboutPage.verifyOnPage(page)

      await expect(aboutPage.noAssessmentDataWarning).toBeVisible()
      await expect(aboutPage.noAssessmentDataWarning).toContainText('There is a problem getting assessment information')

      await expect(aboutPage.noSentenceInfoWarning).not.toBeVisible()

      await expect(aboutPage.sentenceHeading).toBeVisible()
      await expect(aboutPage.sentenceTable).toBeVisible()

      await expect(aboutPage.highScoringAreasHeading).not.toBeVisible()
      await expect(aboutPage.lowScoringAreasHeading).not.toBeVisible()
      await expect(aboutPage.otherAreasHeading).not.toBeVisible()
      await expect(aboutPage.highScoringAreasAccordion).not.toBeVisible()
      await expect(aboutPage.lowScoringAreasAccordion).not.toBeVisible()
      await expect(aboutPage.otherAreasAccordion).not.toBeVisible()
    })

    test('handles assessment API server error the same as not found', async ({
      page,
      coordinatorBuilder,
      handoverBuilder,
      sentencePlanBuilder,
    }) => {
      const association = await coordinatorBuilder.create().save()
      const session = await handoverBuilder.forAssociation(association).save()

      await sentencePlanBuilder.extend(association.sentencePlanId).save()
      await coordinatorApi.stubGetEntityAssessmentError(association.sentencePlanId)

      await navigateToAboutPage(page, addClientIdToHandoverLink(session.handoverLink))

      const aboutPage = await AboutPage.verifyOnPage(page)

      await expect(aboutPage.noAssessmentDataWarning).toBeVisible()
      await expect(aboutPage.sentenceTable).toBeVisible()

      await expect(aboutPage.highScoringAreasHeading).not.toBeVisible()
      await expect(aboutPage.lowScoringAreasHeading).not.toBeVisible()
      await expect(aboutPage.otherAreasHeading).not.toBeVisible()
      await expect(aboutPage.highScoringAreasAccordion).not.toBeVisible()
      await expect(aboutPage.lowScoringAreasAccordion).not.toBeVisible()
      await expect(aboutPage.otherAreasAccordion).not.toBeVisible()
    })
  })

  test.describe('Both sentence information and assessment data are missing', () => {
    test('displays combined error message and hides all content', async ({
      page,
      coordinatorBuilder,
      handoverBuilder,
      sentencePlanBuilder,
    }) => {
      const association = await coordinatorBuilder.create().withCrn('NOTFOUND').save()
      const session = await handoverBuilder.forAssociation(association).save()

      await sentencePlanBuilder.extend(association.sentencePlanId).save()
      await coordinatorApi.stubGetEntityAssessmentNotFound(association.sentencePlanId)

      await navigateToAboutPage(page, addClientIdToHandoverLink(session.handoverLink))

      const aboutPage = await AboutPage.verifyOnPage(page)

      await expect(page.getByText('Try reloading the page')).toBeVisible()

      await expect(aboutPage.noSentenceInfoWarning).not.toBeVisible()
      await expect(aboutPage.noAssessmentDataWarning).not.toBeVisible()

      await expect(aboutPage.sentenceHeading).not.toBeVisible()
      await expect(aboutPage.sentenceTable).not.toBeVisible()
      await expect(aboutPage.highScoringAreasHeading).not.toBeVisible()
      await expect(aboutPage.lowScoringAreasHeading).not.toBeVisible()
      await expect(aboutPage.otherAreasHeading).not.toBeVisible()
      await expect(aboutPage.highScoringAreasAccordion).not.toBeVisible()
      await expect(aboutPage.lowScoringAreasAccordion).not.toBeVisible()
      await expect(aboutPage.otherAreasAccordion).not.toBeVisible()
    })
  })
})
