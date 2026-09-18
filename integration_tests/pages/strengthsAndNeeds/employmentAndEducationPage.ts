import { Question as EmploymentAndEducationQuestions } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/employment-and-education/constants/question'
import { employment } from 'specs/strengthsAndNeeds/sanUtils'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class EmploymentAndEducationPage extends StrengthsAndNeedsPage {
  static readonly section = employment

  static readonly firstStep = 'current-employment'

  readonly questions = this.questionsOf(EmploymentAndEducationQuestions)

  // The form gives has_been_employed a separate question per employment status
  readonly hasBeenEmployed = (status: string) =>
    this.question(`${EmploymentAndEducationQuestions.has_been_employed}_${status.toLowerCase()}`)
}
