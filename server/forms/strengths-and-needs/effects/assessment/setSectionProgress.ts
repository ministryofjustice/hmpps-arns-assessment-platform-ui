import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { SectionComplete } from '../../versions/v1.0/constants/section'

export const setSectionProgress =
  (deps: StrengthsAndNeedsEffectsDeps) =>
  async (context: StrengthsAndNeedsContext, sectionStatusKey: string, status: SectionComplete) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    context.setData(sectionStatusKey, status)

    await deps.api.executeCommand({
      type: 'UpdateAssessmentPropertiesCommand',
      assessmentUuid,
      user,
      added: wrapAll({ [sectionStatusKey]: status }),
      removed: [],
    })
  }
