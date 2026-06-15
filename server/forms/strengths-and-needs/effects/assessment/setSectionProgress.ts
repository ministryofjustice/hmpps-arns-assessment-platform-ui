import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { wrapAll } from "../../../../data/aap-api/wrappers";
import { SectionStatus } from '../../versions/v1.0/constants/section';

type SectionProgressStatus = (typeof SectionStatus)[keyof typeof SectionStatus]

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
