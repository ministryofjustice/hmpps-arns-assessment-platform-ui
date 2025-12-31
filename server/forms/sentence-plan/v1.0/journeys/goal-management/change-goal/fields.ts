import { block, Data, Format, Self, validation } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { GovUKTextInput } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { AccessibleAutocomplete } from '../../../../components'
import { isRelatedToOtherAreas, canStartNow } from '../shared-fields'

const pageHeading = HtmlBlock({
  content: Format(
    `<span class="govuk-caption-l">%1</span>
    <h1 class="govuk-heading-l">Change goal with %2</h1>`,
    Data('activeGoal.areaOfNeedLabel'),
    Data('caseData.name.forename'),
  ),
})

const goalTitle = block<AccessibleAutocomplete>({
  variant: 'accessibleAutocomplete',
  data: Data('currentAreaOfNeed').path('goals'),
  inputClasses: 'govuk-!-width-two-thirds',
  field: GovUKTextInput({
    code: 'goal_title',
    label: {
      text: Format('What goal should %1 try to achieve?', Data('caseData.name.forename')),
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
})

const forename = Data('caseData.name.forename')

export const pageLayout = TemplateWrapper({
  template: `
    <div>
      {{slot:pageHeading}}
      {{slot:goalTitle}}
      {{slot:isRelatedToOtherAreas}}
      {{slot:canStartNow}}
      {{slot:saveGoalButton}}
    </div>
  `,
  slots: {
    pageHeading: [pageHeading],
    goalTitle: [goalTitle],
    isRelatedToOtherAreas: [isRelatedToOtherAreas],
    canStartNow: [canStartNow(forename)],
    saveGoalButton: [saveGoalButton],
  },
})
