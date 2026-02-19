import { Format, step, accessTransition, when } from '@form-engine/form/builders'
import { isOasysAccess, isReadWriteAccess, redirectToPrivacyUnlessAccepted, redirectUnlessSanSp } from '../../guards'
import {
  noAssessmentDataErrorWarning,
  incompleteAssessmentWarning,
  sentenceHeading,
  sentenceTable,
  noSentenceInfo,
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
import { SentencePlanEffects } from '../../../../effects'


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
    noSentenceInfo,
    noAssessmentDataErrorWarning,
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
    accessTransition({
      effects: [SentencePlanEffects.loadAllAreasAssessmentInfo(), SentencePlanEffects.setNavigationReferrer('about')],
    }),
  ],
})
