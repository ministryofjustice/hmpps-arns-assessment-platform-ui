import { Question as OffenceAnalysisQuestions } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/offence-analysis/constants/question'
import { offence } from 'specs/strengthsAndNeedsV2/sanUtils'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class OffenceAnalysisPage extends StrengthsAndNeedsPage {
  static readonly section = offence

  static readonly firstStep = 'offence-analysis'

  readonly questions = this.questionsOf(OffenceAnalysisQuestions)
}
