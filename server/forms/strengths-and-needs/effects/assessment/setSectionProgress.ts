import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { Section, SectionComplete } from '../../versions/v1.0/constants/section'

export const setSectionProgress =
  (deps: StrengthsAndNeedsEffectsDeps) =>
  async (
    context: StrengthsAndNeedsContext,
    section: (typeof Section)[keyof typeof Section],
    status: SectionComplete,
  ) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    context.setData(section.statusKey, status)

    await deps.api.executeCommand({
      type: 'UpdateAssessmentPropertiesCommand',
      assessmentUuid,
      user,
      added: wrapAll({ [section.statusKey]: status }),
      removed: [],
    })
  }
