import { Data, Format, step, accessTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
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
} from './fields'
import { CaseData } from '../../constants'
import { SentencePlanEffects } from '../../../../effects'

export const aboutPersonStep = step({
  path: '/about-person',
  title: 'About',
  view: {
    locals: {
      headerPageHeading: Format(`About %1`, CaseData.Forename),
      buttons: {
        showReturnToOasysButton: isOasysAccess,
        showCreateGoalButton: isReadWriteAccess,
      },
    },
  },
  blocks: [
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
    accessTransition({
      effects: [SentencePlanEffects.loadAllAreasAssessmentInfo(), SentencePlanEffects.setNavigationReferrer('about')],
    }),
  ],
})
