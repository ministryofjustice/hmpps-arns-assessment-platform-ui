import { StrengthsAndNeedsContext } from '../types'

export const setDynamicBacklink = () => async (context: StrengthsAndNeedsContext, basePath: string) => {
  const previousPage = context.getState('previousPageUrl')
  const fallback = (context.getData('viewAllAnswersBacklinkFallback') as string) || basePath
  const isWithinAssessment = typeof previousPage === 'string' && previousPage.startsWith(basePath)

  context.setData('viewAllAnswersBacklink', isWithinAssessment ? previousPage : fallback)
}
