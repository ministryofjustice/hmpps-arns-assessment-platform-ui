import { Question as HealthAndWellbeingQuestions } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/health-wellbeing/constants/question'
import { health } from 'specs/strengthsAndNeeds/sanUtils'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class HealthAndWellbeingPage extends StrengthsAndNeedsPage {
  static readonly section = health

  static readonly firstStep = 'health-wellbeing'

  readonly questions = this.questionsOf(HealthAndWellbeingQuestions)
}
