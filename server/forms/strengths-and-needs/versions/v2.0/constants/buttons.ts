import { and, block, PredicateExpr } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton, GovUKLinkButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { commonContentFor } from '../locales'
import { isEditMode } from '../guards'

export const saveButton = block<GovUKButton>({
  variant: 'govukButton',
  text: commonContentFor('save_and_continue'),
  name: 'action',
  value: 'save',
  visibleWhen: isEditMode,
})

export const markAsCompleteButton = block<GovUKButton>({
  variant: 'govukButton',
  text: commonContentFor('mark_as_complete'),
  name: 'action',
  value: 'save',
  visibleWhen: isEditMode,
})

export const goToPractitionerAnalysisButton = (
  sectionSummaryPath: string,
  anchor = 'practitioner-analysis',
  visibleWhen?: PredicateExpr,
) =>
  GovUKLinkButton({
    text: commonContentFor('go_to_practitioner_analysis'),
    href: `${sectionSummaryPath}#${anchor}`,
    classes: 'govuk-button--secondary',
    visibleWhen: visibleWhen ? and(isEditMode, visibleWhen) : isEditMode,
  })
