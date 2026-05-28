import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { pageHeading, pageContent } from './fields'

export const accessibilityStep = step({
  path: '/accessibility',
  title: 'Accessibility statement for Assess and plan: Sentence plan',
  view: {
    template: 'platform/views/platform-policy-step',
    locals: {
      footerBaseUrl: '/platform',
      hideSessionTimeoutModal: true,
    },
  },
  blocks: [pageHeading, pageContent],
})
