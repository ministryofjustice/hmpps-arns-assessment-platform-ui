import { Question as AlcoholUseQuestions } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/alcohol-use/constants/question'
import { alcohol } from 'specs/strengthsAndNeeds/sanUtils'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class AlcoholUsePage extends StrengthsAndNeedsPage {
  static readonly section = alcohol

  static readonly firstStep = 'alcohol-use'

  readonly questions = this.questionsOf(AlcoholUseQuestions)
}
