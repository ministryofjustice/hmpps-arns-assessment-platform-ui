import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
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
    GovUKButton({ text: 'Save and continue' }),
  ],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.CalculateRiskActuarialScores(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [redirect({ goto: 'date-of-current-supervision' })],
      },
    }),
  ],
})
