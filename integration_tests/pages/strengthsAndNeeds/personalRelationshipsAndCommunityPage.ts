import { Question as PersonalRelationshipsAndCommunityQuestions } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/personal-relationships-and-community/constants/question'
import { personal } from 'specs/strengthsAndNeeds/sanUtils'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class PersonalRelationshipsAndCommunityPage extends StrengthsAndNeedsPage {
  static readonly section = personal

  static readonly firstStep = 'personal-relationships-children-information'

  readonly questions = this.questionsOf(PersonalRelationshipsAndCommunityQuestions)
}
