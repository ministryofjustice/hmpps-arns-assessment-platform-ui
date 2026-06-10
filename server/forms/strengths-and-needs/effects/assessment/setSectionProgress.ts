import {SectionProgressStatus, StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps} from '../types'
import {wrapAll} from "../../../../data/aap-api/wrappers";

export const setSectionProgress =
  (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext, code: string, status: SectionProgressStatus) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    context.setData(code, status)

    await deps.api.executeCommand({
      type: 'UpdateAssessmentPropertiesCommand',
      assessmentUuid,
      user: user,
      added: wrapAll(
        {[code]: status}),
      removed: [],
    })
  }
