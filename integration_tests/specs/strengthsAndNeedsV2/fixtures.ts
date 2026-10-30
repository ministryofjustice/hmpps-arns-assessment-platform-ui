import type { AnswerConfig, DataConfig } from '../../builders/types'
import { test as base, TargetService } from '../../support/fixtures'
import { buildEditUrl, navigateToStrengthsAndNeeds, sanFormPath } from './sanUtils'

export type Answer = AnswerConfig
export type Data = DataConfig

/**
 * Strengths and needs fixtures.
 *
 * `openSection(section, answers)` seeds the answers and opens the assessment,
 * returning the section's URL.
 */
export const test = base.extend<{
  openSection: (
    sectionPath: string,
    answers: Answer[],
    userSubmittedSteps?: string[],
    collections?: AnswerConfig[],
  ) => Promise<string>
}>({
  openSection: async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }, use) => {
    await use(async (sectionPath, answers, userSubmittedSteps, collections) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      const builder = strengthsAndNeedsBuilder
        .extend(sanAssessmentId)
        .withAnswers(answers)
        .withUserSubmittedSteps(userSubmittedSteps)

      if (collections) {
        builder.withCollectionItems('OFFENCE_ANALYSIS_VICTIM', collections)
      }

      await builder.save()
      await navigateToStrengthsAndNeeds(page, handoverLink, sanFormPath)

      return buildEditUrl(baseURL, sanAssessmentId, sectionPath)
    })
  },
})
