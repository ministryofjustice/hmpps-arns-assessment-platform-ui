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
import {Step} from "../../constants/step";
import {sectionPath} from "../../../../constants/path";
import {Section} from "../../../../constants/section";

const saveButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const physicalMentalHealthStep = step({
  path: `/${Step.physical_mental_health.path}`,
  title: 'Physical mental health',
  view: {
    locals: {
      backlink: sectionPath(Section.health_and_wellbeing),
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
