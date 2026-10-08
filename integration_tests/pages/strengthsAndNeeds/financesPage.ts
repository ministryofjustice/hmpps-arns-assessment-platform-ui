import { Question as FinancesQuestions } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/finance/constants/question'
import { finances } from 'specs/strengthsAndNeeds/sanUtils'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class FinancesPage extends StrengthsAndNeedsPage {
  static readonly section = finances

  static readonly firstStep = 'finance'

  readonly questions = this.questionsOf(FinancesQuestions)
}
