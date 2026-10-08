import { Question as AccommodationQuestions } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/accommodation/constants/question'
import { accommodation } from 'specs/strengthsAndNeeds/sanUtils'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class AccommodationPage extends StrengthsAndNeedsPage {
  static readonly section = accommodation

  static readonly firstStep = 'accommodation-status'

  readonly questions = this.questionsOf(AccommodationQuestions)
}
