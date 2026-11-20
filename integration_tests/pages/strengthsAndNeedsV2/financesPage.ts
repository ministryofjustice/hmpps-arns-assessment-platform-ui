import { Question as FinancesQuestions } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/finance/constants/question'
import { finances } from 'specs/strengthsAndNeedsV2/sanUtils'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class FinancesPage extends StrengthsAndNeedsPage {
  static readonly section = finances

  static readonly firstStep = 'finance-income'

  readonly questions = this.questionsOf(FinancesQuestions)
}
