import {block, Condition, Post, redirect, step, submit} from '@ministryofjustice/hmpps-forge/core/authoring'
import {GovUKButton} from '@ministryofjustice/hmpps-forge/govuk-components'
import {StrengthsAndNeedsEffects} from '../../../../../../effects'
import {
  attitudeTowardsSelf,
  changesToHealthWellbeing,
  copeWithDayToDayLife,
  feelingsAboutFuture,
  headInjuries,
  helpedDuringPeriodsGoodHealthWellbeing,
  impactOnLearningAbilities,
  neurodiverseConditions,
  prescribedMentalHealthMedicationsTreatments,
  prescribedPhysicalHealthMedicationsTreatments,
  psychiatricTreatment,
  selfHarm,
  suicidalTendencies
} from './fields'

const saveButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const physicalMentalHealthStep = step({
  path: '/physical-mental-health',
  title: 'Physical mental health',
  view: {
    template: 'strengths-and-needs/views/san-step',
    locals: {
      backlink: '/strengths-and-needs/v1.0/health-and-wellbeing'
    },
  },
  blocks: [
    prescribedPhysicalHealthMedicationsTreatments,
    prescribedMentalHealthMedicationsTreatments,
    psychiatricTreatment,
    headInjuries,
    neurodiverseConditions,
    impactOnLearningAbilities,
    copeWithDayToDayLife,
    attitudeTowardsSelf,
    selfHarm,
    suicidalTendencies,
    feelingsAboutFuture,
    helpedDuringPeriodsGoodHealthWellbeing,
    changesToHealthWellbeing,
    saveButton,
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress('health_section_status','INCOMPLETE')
        ],
        next: [
          redirect({
            goto: 'health-wellbeing-summary',
          })],
      },
    }),
  ],
})
