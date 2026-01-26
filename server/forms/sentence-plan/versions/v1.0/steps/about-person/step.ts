import { accessTransition, Data, Format, redirect, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import {
  incompleteAssessmentWarning,
  sentenceInformationSection,
  assessmentInformationSection,
  continueButton,
} from './fields'
import { CaseData } from '../../constants'
import { SentencePlanEffects } from '../../../../effects'

export const aboutPersonStep = step({
  path: '/about-person',
  title: 'About the Person',
  view: {
    locals: {
      headerPageHeading: Format(`About %1`, CaseData.Forename),
      buttons: {
        showReturnToOasysButton: Data('user.authSource').match(Condition.Equals('handover')),
        showCreateGoalButton: true,
      },
    },
  },
  blocks: [incompleteAssessmentWarning, sentenceInformationSection, assessmentInformationSection, continueButton],
  onAccess: [
    accessTransition({
      effects: [SentencePlanEffects.loadAboutPageData()],
    }),
  ],
  onSubmission: [
    submitTransition({
      onAlways: {
        next: [redirect({ goto: '/plan-overview/plan' })],
      },
    }),
  ],
})
