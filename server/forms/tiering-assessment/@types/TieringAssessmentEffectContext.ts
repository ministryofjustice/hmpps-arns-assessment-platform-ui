import { EffectFunctionContext } from '@ministryofjustice/hmpps-forge/core'
import { SentencePlanState } from './SentencePlanState'
import { TieringAssessmentSession } from './TieringAssessmentSession'
import { TieringAssessmentData } from './TieringAssessmentData'

export type TieringAssessmentEffectContext = EffectFunctionContext<
  Record<string, unknown>,
  TieringAssessmentData,
  TieringAssessmentSession,
  SentencePlanState
>
