import { Data, Format, Self, validation, Condition, Transformer } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton, GovUKTextInput, GovUKHeading } from '@ministryofjustice/hmpps-forge/govuk-components'
import { TemplateWrapper } from '@ministryofjustice/hmpps-forge/core/components'
import { AccessibleAutocomplete, AssessmentInfoDetails } from '../../../../../components'
import { CaseData } from '../../../constants'
import { canAccessSanContent } from '../../../guards'
import { isRelatedToOtherAreas, canStartNow } from '../sharedFields'

const pageHeading = GovUKHeading({
  caption: Data('activeGoal.areaOfNeedLabel').pipe(Transformer.String.EscapeHtml()),
  text: Format('Change goal with %1', CaseData.Forename),
})

const assessmentInfoDetails = AssessmentInfoDetails({
  personName: CaseData.Forename,
  areaName: Data('currentAreaOfNeed').path('text'),
  assessmentData: Data('currentAreaAssessment'),
  status: Data('currentAreaAssessmentStatus'),
  visibleWhen: canAccessSanContent,
})

const goalTitle = AccessibleAutocomplete({
  data: Data('currentAreaOfNeed').path('goals'),
  inputClasses: 'govuk-!-width-two-thirds',
  field: GovUKTextInput({
    code: 'goal_title',
    label: {
      text: Format('What goal should %1 try to achieve?', CaseData.Forename),
      classes: 'govuk-label--m',
    },
    hint: 'Search for a suggested goal or enter your own. Add one goal at a time.',
    validWhen: [
      validation({
        condition: Self().match(Condition.IsRequired()),
        message: 'Select or enter what goal they should try to achieve',
      }),
    ],
  }),
})

const saveGoalButton = GovUKButton({
  text: 'Save goal',
  name: 'action',
  value: 'saveGoal',
  preventDoubleClick: true,
  attributes: {
    'data-ai-id': 'change-goal-save-button',
  },
})

export const pageLayout = TemplateWrapper({
  template: `
    <div>
      {{slot:pageHeading}}
      {{slot:assessmentInfoDetails}}
      {{slot:goalTitle}}
      {{slot:isRelatedToOtherAreas}}
      {{slot:canStartNow}}
      {{slot:saveGoalButton}}
    </div>
  `,
  slots: {
    pageHeading: [pageHeading],
    assessmentInfoDetails: [assessmentInfoDetails],
    goalTitle: [goalTitle],
    isRelatedToOtherAreas: [isRelatedToOtherAreas],
    canStartNow: [canStartNow],
    saveGoalButton: [saveGoalButton],
  },
})
