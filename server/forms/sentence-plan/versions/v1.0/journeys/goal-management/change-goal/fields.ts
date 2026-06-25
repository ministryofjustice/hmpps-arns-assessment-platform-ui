import { Data, Format, Self, validation, Condition, Transformer } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton,
  GovUKTextInput,
  GovUKHeading,
  GovUKInsetText,
  GovUKBody,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { TemplateWrapper } from '@ministryofjustice/hmpps-forge/core/components'
import { AccessibleAutocomplete, AssessmentInfoDetails } from '../../../../../components'
import { CaseData } from '../../../constants'
import { canAccessSanContent } from '../../../guards'
import { isRelatedToOtherAreas, canStartNow } from '../sharedFields'

const pageHeading = GovUKHeading({
  text: 'Update goal',
})

const assessmentInfoDetails = AssessmentInfoDetails({
  personName: CaseData.Forename,
  areaName: Data('currentAreaOfNeed.text'),
  assessmentData: Data('currentAreaAssessment'),
  status: Data('currentAreaAssessmentStatus'),
  visibleWhen: canAccessSanContent,
})

const goalTitle = AccessibleAutocomplete({
  data: Data('currentAreaOfNeed.goals'),
  classes: 'govuk-!-width-two-thirds',
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

// TODO (Step 3): point at the new "Change area of need" flow for an existing goal
const changeAreaOfNeedHref = Format('../../goal/%1/change-area-of-need', Data('activeGoal.uuid'))

const areaOfNeedInset = GovUKInsetText({
  blocks: [
    GovUKBody({
      text: Format(
        'Area of need: <strong>%1</strong>',
        Data('activeGoal.areaOfNeedLabel').pipe(Transformer.String.ToLowerCase(), Transformer.String.EscapeHtml()),
      ),
    }),
    GovUKBody({
      classes: 'govuk-!-margin-bottom-0',
      text: Format(
        '<a class="govuk-link govuk-link--no-visited-state" href="%1" data-ai-id="update-goal-change-area-of-need-link">Change area of need.</a>',
        changeAreaOfNeedHref,
      ),
    }),
  ],
})

const addOrUpdateStepsButton = GovUKButton({
  text: 'Add or update steps',
  classes: 'govuk-button--secondary',
  name: 'action',
  value: 'addSteps',
  preventDoubleClick: true,
  attributes: {
    'data-ai-id': 'update-goal-add-steps-button',
  },
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

const buttonGroup = TemplateWrapper({
  template: `
      <div class="govuk-button-group">
        {{slot:saveGoalButton}}
        {{slot:addOrUpdateStepsButton}}
      </div>
    `,
  slots: {
    saveGoalButton: [saveGoalButton],
    addOrUpdateStepsButton: [addOrUpdateStepsButton],
  },
})

export const pageLayout = TemplateWrapper({
  template: `
    <div>
      {{slot:pageHeading}}
      {{slot:assessmentInfoDetails}}
      {{slot:goalTitle}}
      {{slot:areaOfNeedInset}}
      {{slot:isRelatedToOtherAreas}}
      {{slot:canStartNow}}
      {{slot:buttonGroup}}
    </div>
  `,
  slots: {
    pageHeading: [pageHeading],
    assessmentInfoDetails: [assessmentInfoDetails],
    goalTitle: [goalTitle],
    areaOfNeedInset: [areaOfNeedInset],
    isRelatedToOtherAreas: [isRelatedToOtherAreas],
    canStartNow: [canStartNow],
    buttonGroup: [buttonGroup],
  },
})
