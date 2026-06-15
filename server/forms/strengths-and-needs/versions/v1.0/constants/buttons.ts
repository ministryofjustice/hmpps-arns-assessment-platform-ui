import { block } from '@ministryofjustice/hmpps-forge/core/authoring';
import { GovUKButton, GovUKLinkButton } from '@ministryofjustice/hmpps-forge/govuk-components';
import { commonLocale } from './locale';

export const saveButton = block<GovUKButton>({
  variant: 'govukButton',
  text: commonLocale.save_and_continue,
  name: 'action',
  value: 'save',
})

export const markAsCompleteButton = block<GovUKButton>({
  variant: 'govukButton',
  text: commonLocale.mark_as_complete,
  name: 'action',
  value: 'save',
})

export const goToPractitionerAnalysisButton = (sectionSummaryPath: string) => GovUKLinkButton({
  text: commonLocale.go_to_practitioner_analysis,
  href:`${sectionSummaryPath}#practitioner-analysis`,
  classes: 'govuk-button--secondary'
})
