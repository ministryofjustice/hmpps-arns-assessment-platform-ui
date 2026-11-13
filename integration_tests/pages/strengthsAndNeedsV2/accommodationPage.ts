import { Question as AccommodationQuestions } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/question'
import { accommodation } from 'specs/strengthsAndNeedsV2/sanUtils'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class AccommodationPage extends StrengthsAndNeedsPage {
  static readonly section = accommodation

  static readonly firstStep = 'accommodation-community-current-accommodation'

  readonly questions = this.questionsOf(AccommodationQuestions)
}
