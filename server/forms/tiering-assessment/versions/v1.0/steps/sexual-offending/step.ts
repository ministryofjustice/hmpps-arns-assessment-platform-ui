import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import {
  contactChildSexualDetailsField,
  contactSexualDetailsField,
  currentAndRecentSexualOffendingHeadingField,
  directContactSexualOffendingHeadingField,
  imagesAndIndirectContactHeadingField,
  indecentImagesOfChildrenDetailsField,
  nonContactDetailsField,
  sectionBreakField,
  sexualOffendingInsetField,
  sexualOffendingFields,
  victimStrangerDetailsField,
} from './fields'
import { continueButton, redirectToCheckYourAnswers } from '../../common'
import { sectionPageTitle } from '../../locales'
import { Step } from '../../constants/page'

export const sexualOffendingStep = step({
  path: `${Step.sexual_offending.path}`,
  title: sectionPageTitle(Step.sexual_offending),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [
    sexualOffendingInsetField,
    currentAndRecentSexualOffendingHeadingField,
    sexualOffendingFields.questions.currentOffenceSexualRadioQuestion.displayModes.field,
    sexualOffendingFields.questions.dateOfMostRecentSexualOffenceQuestion.displayModes.field,
    sectionBreakField,
    directContactSexualOffendingHeadingField,
    sexualOffendingFields.questions.contactSanctionsQuestion.displayModes.field,
    contactSexualDetailsField,
    sexualOffendingFields.questions.contactChildSanctionsQuestion.displayModes.field,
    contactChildSexualDetailsField,
    sexualOffendingFields.questions.victimStrangerQuestion.displayModes.field,
    victimStrangerDetailsField,
    sectionBreakField,
    imagesAndIndirectContactHeadingField,
    sexualOffendingFields.questions.indecentImagesOfChildrenQuestion.displayModes.field,
    indecentImagesOfChildrenDetailsField,
    sexualOffendingFields.questions.nonContactQuestion.displayModes.field,
    nonContactDetailsField,
    continueButton,
  ],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.CalculateRiskActuarialScores(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [redirectToCheckYourAnswers, redirect({ goto: Step.date_of_current_supervision.path })],
      },
    }),
  ],
})
