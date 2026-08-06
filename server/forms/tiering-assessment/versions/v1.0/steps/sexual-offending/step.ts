import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import {
  contactChildSanctionsField,
  contactChildSexualDetailsField,
  contactSanctionsField,
  contactSexualDetailsField,
  currentAndRecentSexualOffendingHeadingField,
  currentOffenceSexualRadioField,
  dateOfMostRecentSexualOffenceField,
  directContactSexualOffendingHeadingField,
  imagesAndIndirectContactHeadingField,
  indecentImagesOfChildrenDetailsField,
  indecentImagesOfChildrenField,
  nonContactDetailsField,
  nonContactField,
  sectionBreakField,
  sexualOffendingInsetField,
  victimStrangerDetailsField,
  victimStrangerField,
} from './fields'
import { continueButton, redirectToCheckYourAnswers } from '../../common'

export const sexualOffendingStep = step({
  path: '/sexual-offending',
  title: 'Sexual offending',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
  blocks: [
    sexualOffendingInsetField,
    currentAndRecentSexualOffendingHeadingField,
    currentOffenceSexualRadioField,
    dateOfMostRecentSexualOffenceField,
    sectionBreakField,
    directContactSexualOffendingHeadingField,
    contactSanctionsField,
    contactSexualDetailsField,
    contactChildSanctionsField,
    contactChildSexualDetailsField,
    victimStrangerField,
    victimStrangerDetailsField,
    sectionBreakField,
    imagesAndIndirectContactHeadingField,
    indecentImagesOfChildrenField,
    indecentImagesOfChildrenDetailsField,
    nonContactField,
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
       next: [redirectToCheckYourAnswers, redirect({ goto: 'date-of-current-supervision' })],
      },
    }),
  ],
})
