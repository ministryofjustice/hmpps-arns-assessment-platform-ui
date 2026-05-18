import { Data, Format, not, Self, validation } from '@form-engine/form/builders'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { GovUKTextInput } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKHeading } from '@form-engine-govuk-components/wrappers/govukHeading'
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
  hidden: not(canAccessSanContent),
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
    validate: [
      validation({
        when: Self().not.match(Condition.IsRequired()),
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
