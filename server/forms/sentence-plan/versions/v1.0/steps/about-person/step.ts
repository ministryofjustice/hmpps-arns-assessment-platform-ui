import { Format, redirect, step, submitTransition } from '@form-engine/form/builders'
import { continueButton } from './fields'
import { CaseData } from '../../constants'
import { isOasysAccess, isReadWriteAccess } from '../../guards'

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
  // TODO: once this page is build, we need to add SentencePlanEffects.setNavigationReferrer('about') into onLoad/onAccess effects
  //  and add it as a link for back button in 'create a goal' and 'view previous versions pages'
  blocks: [continueButton],
  onSubmission: [
    submitTransition({
      onAlways: {
        next: [redirect({ goto: '/plan-overview/plan' })],
      },
    }),
  ],
})
