import { Format, step, access, when } from '@ministryofjustice/hmpps-forge/core/authoring'
import { isOasysAccess, isReadWriteAccess, redirectToPrivacyUnlessAccepted, redirectUnlessSanSp } from '../../guards'
import {
  assessmentDataLoadFailureWarning,
  incompleteAssessmentWarning,
  sentenceHeading,
  sentenceTable,
  nDeliusFailureWarningNoSentenceInfo,
  assessmentLastUpdated,
  incompleteAreasHeading,
  incompleteAreasAccordion,
  highScoringAreasHeading,
  highScoringAreasAccordion,
  lowScoringAreasHeading,
  lowScoringAreasAccordion,
  otherAreasHeading,
  otherAreasAccordion,
  sentenceInformationMissingAndAssessmentErrorMessage,
  isSentenceInformationAndAssessmentLoadingError,
} from './fields'
import { CaseData, sentencePlanOverviewPath } from '../../constants'
import { AuditEvent, SentencePlanEffects } from '../../../../effects'

export const aboutPersonStep = step({
  path: '/about-person',
  title: 'About',
  view: {
    locals: {
      headerPageHeading: when(isSentenceInformationAndAssessmentLoadingError)
        .then('Sorry, there is a problem')
        .else(Format(`About %1`, CaseData.Forename)),
      buttons: {
        showReturnToOasysButton: isOasysAccess,
        showCreateGoalButton: isReadWriteAccess,
      },
    },
  },
  blocks: [
    sentenceInformationMissingAndAssessmentErrorMessage,
    incompleteAssessmentWarning,
    assessmentLastUpdated,
    sentenceHeading,
    sentenceTable,
    nDeliusFailureWarningNoSentenceInfo,
    assessmentDataLoadFailureWarning,
    incompleteAreasHeading,
    incompleteAreasAccordion,
    highScoringAreasHeading,
    ...highScoringAreasAccordion,
    lowScoringAreasHeading,
    ...lowScoringAreasAccordion,
    otherAreasHeading,
    otherAreasAccordion,
  ],
  onAccess: [
    redirectToPrivacyUnlessAccepted(),
    redirectUnlessSanSp(sentencePlanOverviewPath),
    access({
      effects: [
        SentencePlanEffects.sendAuditEvent(AuditEvent.VIEW_ABOUT_PERSON),
        SentencePlanEffects.loadSentenceInformation(),
        SentencePlanEffects.loadAllAreasAssessmentInfo(),
      ],
    }),
  ],
})
