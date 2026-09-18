import { Question as DrugUseQuestions } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/drug-use/constants/question'
import { drugUse } from 'specs/strengthsAndNeeds/sanUtils'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class DrugUsePage extends StrengthsAndNeedsPage {
  static readonly section = drugUse

  static readonly firstStep = 'drug-use'

  readonly questions = this.questionsOf(DrugUseQuestions)
}
