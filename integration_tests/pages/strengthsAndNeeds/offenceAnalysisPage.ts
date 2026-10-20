import { Question as OffenceAnalysisQuestions } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/offence-analysis/constants/question'
import { offence } from 'specs/strengthsAndNeeds/sanUtils'
import { Locator } from '@playwright/test'
import StrengthsAndNeedsPage from './strengthsAndNeedsPage'

export default class OffenceAnalysisPage extends StrengthsAndNeedsPage {
  static readonly section = offence

  static readonly firstStep = 'offence-analysis'

  readonly changeVictim: Locator = this.page.getByRole('link', { name: 'Change   (First victim)' })

  readonly questions = this.questionsOf(OffenceAnalysisQuestions)
}
