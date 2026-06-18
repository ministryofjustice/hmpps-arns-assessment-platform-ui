import {
  access,
  Answer,
  Condition,
  createForgePackage, Data, Format,
  journey,
  redirect, Self,
  Session,
  step,
  submit,
  tieBreaker, validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKButton,
  GovUKPanel, GovUKRadioInput,
  GovUKSummaryList,
  GovUKTextInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { TieringAssessmentEffectsDeps } from './effects/types'
import { TieringAssessmentEffects, TieringAssessmentEffectsImplementations } from './effects/effects'
import { TieringAssessmentFunctions } from './effects/functions'
import { CaseData } from '../sentence-plan/versions/v1.0/constants'

const introStep = step({
  path: '/intro',
  title: 'Intro',
  reachability: { entryWhen: true },
  blocks: [
    GovUKBody({
      text: `This demo creates a new assessment in the AAP API database, asks the static tiering assessment questions,
       and calculates risk scores. On each page save an aggregate is stored in the database.`,
    }),
    GovUKTextInput({
      code: 'assessment-uuid',
      label: 'Assessment UUID',
      hint: 'Enter an assessment UUID to load, or leave blank to create a new assessment',
      classes: "govuk-input--width-20",
    }),
    GovUKButton({ text: 'Continue' }),
  ],
  onSubmission: [
    submit({
      validate: false,
      onAlways: {
        effects: [
          TieringAssessmentEffects.InitialiseAssessment(),
        ],
        next: [redirect({ goto: 'static-questions' })],
      },
    }),
  ],
})

const staticQuestionsStep = step({
  path: '/static-questions',
  title: 'Static questions',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
  blocks: [
    GovUKRadioInput({
      code: 'gender',
      label: 'Gender',
      items: [
        { value: 'MALE', text: 'Male' },
        { value: 'FEMALE', text: 'Female' },
      ],
      validWhen: [
        validation({
          condition: Self().match(Condition.IsRequired()),
          message: 'Gender is a required field',
        }),
      ],
    }),
    GovUKTextInput({
      code: 'date-of-birth',
      label: 'Date of birth',
      classes: "govuk-input--width-10",
      validWhen: [
        validation({
          condition: Self().match(Condition.IsRequired()),
          message: 'Date of birth is a required field',
        }),
        validation({
          condition: Self().match(Condition.Date.IsValid()),
          message: 'Date of birth should be YYYY-MM-DD',
        }),
      ],
    }),
    GovUKTextInput({
      code: 'date-of-current-conviction',
      label: 'Date of current conviction',
      classes: "govuk-input--width-10",
      validWhen: [
        validation({
          condition: Self().match(Condition.IsRequired()),
          message: 'Date current conviction is a required field',
        }),
        validation({
          condition: Self().match(Condition.Date.IsValid()),
          message: 'Date current conviction should be YYYY-MM-DD',
        }),
      ],
    }),
    GovUKTextInput({
      code: 'date-at-start-of-followup',
      label: 'Date at start of followup',
      classes: "govuk-input--width-10",
      validWhen: [
        validation({
          condition: Self().match(Condition.IsRequired()),
          message: 'Date at start of followup is a required field',
        }),
        validation({
          condition: Self().match(Condition.Date.IsValid()),
          message: 'Date at start of followup should be YYYY-MM-DD',
        }),
      ],
    }),
    GovUKTextInput({
      code: 'total-number-of-sanctions',
      label: 'Total number of sanctions',
      classes: "govuk-input--width-2",
      validWhen: [
        validation({
          condition: Self().match(Condition.IsRequired()),
          message: 'Total number of sanctions is a required field',
        }),
        validation({
          condition: Self().match(Condition.String.DigitsOnly()),
          message: 'Total number of sanctions should be a number',
        }),
      ],
    }),
    GovUKTextInput({
      code: 'age-at-first-sanction',
      label: 'Age at first sanction',
      classes: "govuk-input--width-2",
      validWhen: [
        validation({
          condition: Self().match(Condition.IsRequired()),
          message: 'Age at first sanction is a required field',
        }),
        validation({
          condition: Self().match(Condition.String.DigitsOnly()),
          message: 'Age at first sanction should be a number',
        }),
      ],
    }),
    GovUKTextInput({
      code: 'offence-code',
      label: 'Offence code',
      hint: 'For example 10426',
      classes: "govuk-input--width-5",
      validWhen: [
        validation({
          condition: Self().match(Condition.IsRequired()),
          message: 'Offence code is a required field',
        }),
        validation({
          condition: Self().match(Condition.String.MatchesRegex('^\\d{5}$')),
          message: 'Offence code should be 5 digits',
        }),
      ],
    }),
    GovUKButton({ text: 'Continue' }),
  ],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.CalculateRiskActuarialScores(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [redirect({ goto: 'summary' })],
      },
    }),
  ],
})

const summaryStep = step({
  path: '/summary',
  title: 'Summary',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
  blocks: [
    GovUKSummaryList({
      card: {
        title: {
          text: 'Assessment',
        }
      },
      rows: [
        {
          key: { text: 'Gender' },
          value: { text: Answer('gender') },
          actions: { items: [{ href: 'static-questions', text: 'Change' }] },
        },
        {
          key: { text: 'Date of birth' },
          value: { text: Answer('date-of-birth') },
          actions: { items: [{ href: 'static-questions', text: 'Change' }] },
        },
        {
          key: { text: 'Date of current conviction' },
          value: { text: Answer('date-of-current-conviction') },
          actions: { items: [{ href: 'static-questions', text: 'Change' }] },
        },
        {
          key: { text: 'Date at start of followup' },
          value: { text: Answer('date-at-start-of-followup') },
          actions: { items: [{ href: 'static-questions', text: 'Change' }] },
        },
        {
          key: { text: 'Total number of sanctions' },
          value: { text: Answer('total-number-of-sanctions') },
          actions: { items: [{ href: 'static-questions', text: 'Change' }] },
        },
        {
          key: { text: 'Age at first sanction' },
          value: { text: Answer('age-at-first-sanction') },
          actions: { items: [{ href: 'static-questions', text: 'Change' }] },
        },
        {
          key: { text: 'Offence code' },
          value: { text: Answer('offence-code') },
          actions: { items: [{ href: 'static-questions', text: 'Change' }] },
        },
      ],
    }),
    GovUKSummaryList({
      card: {
        title: {
          text: 'Risk predictor scores',
        }
      },
      rows: [
        {
          key: { text: 'OGRS3 score' },
          value: { text: Answer('risk-scores-ogrs3-score') },
        },
        {
          key: { text: 'OGRS3 band' },
          value: { text: Answer('risk-scores-ogrs3-band') },
        },
        {
          key: { text: 'Validation errors' },
          value: { text: Answer('risk-scores-ogrs3-errors') },
        },
      ],
    }),
    GovUKButton({ text: 'Confirm' }),
  ],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.SetAssessmentComplete()
        ],
        next: [
          redirect({
            goto: 'confirmation',
          }),
        ],
      },
    }),
  ],
})

const confirmationStep = step({
  code: 'confirmation',
  path: '/confirmation',
  title: 'Answers saved',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.SetupUUIDInData()],
    }),
  ],
  blocks: [
    GovUKPanel({
      titleText: 'Answers saved',
    }),
    GovUKBody({
      text: Format('Your answers have been saved with UUID %1', Data('assessment-uuid')),
    }),
    GovUKButton({
      text: 'Restart',
      classes: 'govuk-button--secondary',
    }),
  ],
  onSubmission: [
    submit({
      validate: false,
      onAlways: {
        next: [redirect({ goto: 'intro' })],
      },
    }),
  ],
})

const tieringAssessmentJourney = journey({
  code: 'tiering-assessment',
  title: 'Tiering Assessment',
  path: '/tiering-assessment',
  reachability: { disableReachabilityChecks: true },
  steps: [introStep, staticQuestionsStep, summaryStep, confirmationStep],
})

export default createForgePackage<TieringAssessmentEffectsDeps>({
  enabled: true,
  functions: {
    ...TieringAssessmentEffectsImplementations,
    ...TieringAssessmentFunctions.implementations,
  },
  journey: tieringAssessmentJourney,
})
