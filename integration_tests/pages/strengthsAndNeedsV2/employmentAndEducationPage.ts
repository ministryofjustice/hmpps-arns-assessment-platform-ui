import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/question'
import { employment } from 'specs/strengthsAndNeedsV2/sanUtils'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/step'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class EmploymentAndEducationPage extends StrengthsAndNeedsPage {
  static readonly section = employment

  static readonly firstStep = Step.employment_status.path

  readonly questions = this.questionsOf(Question)

  // The form gives has_been_employed a separate question per employment status
  readonly hasBeenEmployed = (status: string) =>
    this.question(`${Question.community_ever_had_a_job}_${status.toLowerCase()}`)
}
