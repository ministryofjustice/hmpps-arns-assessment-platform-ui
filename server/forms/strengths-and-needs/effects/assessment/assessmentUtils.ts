import {SentencePlanContext} from "../../../sentence-plan/effects/types";
import {InternalServerError} from "http-errors";
import {EffectContext} from "../../../sentence-plan/effects/goals/goalUtils";
import {StrengthsAndNeedsContext} from "../types";

export const getRequiredEffectContext = (context: StrengthsAndNeedsContext, effectName: string): EffectContext => {
  const user = context.getState('user')
  const assessmentUuid = context.getData('assessmentUuid')
  console.log('MGEO UUID:', assessmentUuid)

  if (!user) {
    throw new InternalServerError(`User is required for ${effectName}`)
  }

  if (!assessmentUuid) {
    throw new InternalServerError(`Assessment UUID is required for ${effectName}`)
  }

  return { user, assessmentUuid }
}
