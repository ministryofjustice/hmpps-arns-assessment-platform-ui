import { Question as HealthAndWellbeingQuestions } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/health-wellbeing/constants/question'
import { health } from 'specs/strengthsAndNeedsV2/sanUtils'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class HealthAndWellbeingPage extends StrengthsAndNeedsPage {
  static readonly section = health

  static readonly firstStep = 'health-wellbeing-status'

  readonly questions = this.questionsOf(HealthAndWellbeingQuestions)
}
