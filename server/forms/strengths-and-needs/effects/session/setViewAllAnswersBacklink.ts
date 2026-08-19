import { StrengthsAndNeedsContext } from '../types'

export const setViewAllAnswersBacklink =
  () => async (context: StrengthsAndNeedsContext, basePath: string, fallback: string) => {
    const previousPage = context.getState('previousPageUrl')
    const isWithinAssessment = typeof previousPage === 'string' && previousPage.startsWith(basePath)

    context.setData('viewAllAnswersBacklink', isWithinAssessment ? previousPage : fallback)
  }
