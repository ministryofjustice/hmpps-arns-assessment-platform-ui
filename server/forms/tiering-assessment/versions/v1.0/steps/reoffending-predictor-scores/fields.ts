import { RiskData } from '@ministryofjustice/hmpps-arns-frontend-components-lib/dist/types/RiskData'
import { GovUKButton, GovUKLinkButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Data } from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { DetailedRiskPredictorScores } from '../../../../components/predictorScoresComponent'

export const scores = DetailedRiskPredictorScores({
  data: Data('riskData') as unknown as RiskData,
  forename: 'Alex',
})

export const buttonGroupStart = HtmlBlock({
  content: `<div class="govuk-button-group">`,
})

const markAsCompleteButton = GovUKButton({
  text: 'Mark this section complete',
})

const checkAnswersGrayButton = GovUKLinkButton({
  text: 'Check answers',
  classes: 'govuk-button--secondary',
  href: '/tiering-assessment/v1.0/check-your-answers',
})

export const buttonGroupEnd = HtmlBlock({
  content: `</div>`,
})

export const buttonGroup = HtmlBlock({
  content: [buttonGroupStart, markAsCompleteButton, checkAnswersGrayButton, buttonGroupEnd],
  classes: 'govuk-!-margin-top-8',
})
