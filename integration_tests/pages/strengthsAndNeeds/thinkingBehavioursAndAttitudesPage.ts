import { Question as ThinkingBehavioursAndAttitudesQuestions } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/thinking-behaviours-and-attitudes/constants/question'
import { thinking } from 'specs/strengthsAndNeeds/sanUtils'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class ThinkingBehavioursAndAttitudesPage extends StrengthsAndNeedsPage {
  static readonly section = thinking

  static readonly firstStep = 'thinking-behaviours'

  readonly questions = this.questionsOf(ThinkingBehavioursAndAttitudesQuestions)
}
