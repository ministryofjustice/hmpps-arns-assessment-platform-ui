import { AssessmentVersionQueryResult } from '../../../interfaces/aap-api/queryResult'
import { CreateAssessmentCommandResult } from '../../../interfaces/aap-api/commandResult'

export interface TieringAssessmentData extends Record<string, unknown> {
  assessment: AssessmentVersionQueryResult | CreateAssessmentCommandResult
  assessmentUuid: string
}
