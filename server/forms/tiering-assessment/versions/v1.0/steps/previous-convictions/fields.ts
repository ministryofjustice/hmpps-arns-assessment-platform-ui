import { GovUKCheckboxInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Condition, Format, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'

export const previousConvictionsField = GovUKCheckboxInput({
  code: 'previous-convictions',
  multiple: true,
  hint: {
    text: "Select all that apply, or select 'None of these offences'.",
  },
  items: [
    {
      value: 'HOMICIDE',
      text: 'Murder, attempted murder, threat or conspiracy to murder or manslaughter',
    },
    {
      value: 'WOUNDING_GBH',
      text: 'Wounding or GBH',
    },
    {
      value: 'RAPE_OR_SERIOUS_SEXUAL_OFFENCE',
      text: 'Rape or serious sexual offence against an adult',
    },
    {
      value: 'SEXUAL_OFFENCE_AGAINST_CHILD',
      text: 'Any sexual offence against a child',
    },
    {
      value: 'OTHER_OFFENCE_AGAINST_CHILD',
      text: 'Any other offence against a child',
    },
    {
      value: 'CRIMINAL_DAMAGE',
      text: 'Criminal damage with intent to endanger life',
    },
    {
      value: 'WEAPON',
      text: 'Any offence involving possession or use of weapons',
    },
    {
      value: 'KIDNAPPING',
      text: 'Kidnapping or false imprisonment',
    },
    {
      value: 'ARSON',
      text: 'Arson',
    },
    {
      value: 'RACIAL_OFFENCE',
      text: 'Racially motivated or racially aggravated offence',
    },
    {
      value: 'AGGRAVATED_BURGLARY',
      text: 'Aggravated burglary',
    },
    {
      value: 'ROBBERY',
      text: 'Robbery',
    },
    {
      value: 'OTHER_SERIOUS_OFFENCE',
      text: 'Any other serious offence (for example, blackmail, harassment, stalking, indecent images of children, child neglect or abduction)',
    },
    {
      value: 'OFFENCE_COMMITTED_IN_CUSTODY',
      text: 'Any offence committed in custody',
    },
    {
      value: 'FIREARMS',
      text: 'Possession of a firearm with intent to endanger life or resist arrest',
    },
    {
      divider: 'or',
    },
    {
      value: 'NA',
      text: 'None of these offences',
      behaviour: 'exclusive',
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: Format("Select all that apply, or select 'None of these offences'.", CaseData.ForenamePossessive),
    }),
  ],
})
