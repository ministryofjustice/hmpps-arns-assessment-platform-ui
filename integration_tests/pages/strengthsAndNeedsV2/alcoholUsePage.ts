import { Question as AlcoholUseQuestions } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/alcohol-use/constants/question'
import { alcohol } from 'specs/strengthsAndNeedsV2/sanUtils'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class AlcoholUsePage extends StrengthsAndNeedsPage {
  static readonly section = alcohol

  static readonly firstStep = 'alcohol-use-details'

  readonly questions = this.questionsOf(AlcoholUseQuestions)
}
