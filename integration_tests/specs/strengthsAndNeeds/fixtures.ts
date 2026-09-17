import { test as base, TargetService } from '../../support/fixtures'
import { navigateToStrengthsAndNeeds, sanFormPath, v1Path } from './sanUtils'

export type Answer = { question: string; value: string | string[] }

/**
 * Strengths and needs fixtures.
 *
 * `openSection(section, answers)` seeds the answers and opens the assessment,
 * returning the section's URL.
 */
export const test = base.extend<{ openSection: (sectionPath: string, answers: Answer[]) => Promise<string> }>({
  openSection: async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }, use) => {
    await use(async (sectionPath, answers) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder.extend(sanAssessmentId).withAnswers(answers).save()
      await navigateToStrengthsAndNeeds(page, handoverLink, sanFormPath)

      return `${baseURL}${sanFormPath}${v1Path}/edit/${sanAssessmentId}${sectionPath}`
    })
  },
})
