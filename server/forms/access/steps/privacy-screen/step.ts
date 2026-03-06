import { accessTransition, Data, redirect, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { AccessEffects } from '../../effects'
import { privacyScreenContent } from './fields'

export const privacyScreenStep = step({
  path: '/privacy-screen',
  title: 'Close other applications',
  view: {
    template: 'access/views/access-form-step',
    locals: {
      footerBaseUrl: '/platform',
      hideSessionTimeoutModal: true,
      hmppsHeaderServiceNameLink: '/',
    },
  },
  blocks: [privacyScreenContent],
  onAccess: [
    accessTransition({
      effects: [AccessEffects.loadPrivacyScreenSessionData()],
      next: [
        redirect({
          when: Data('session.privacyAccepted').match(Condition.Equals(true)),
          goto: Data('redirectPath'),
        }),
      ],
    }),
  ],
  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {
        effects: [
          AccessEffects.loadPrivacyScreenSessionData(),
          AccessEffects.setPrivacyAccepted(),
          AccessEffects.sendPrivacyScreenAuditEvent(),
        ],
        next: [redirect({ goto: Data('redirectPath') })],
      },
    }),
  ],
})
