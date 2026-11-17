import { Query, step } from '@ministryofjustice/hmpps-forge/core/authoring'

export const sessionTimeoutStepPath = '/session-timeout'

/**
 * Shared timeout page for every service. The session has usually expired by now, so the modal
 * passes the service (`service`) and how the user signed in (`auth`) in the URL instead.
 */
export const sessionTimeoutStep = step({
  path: sessionTimeoutStepPath,
  title: 'Session timeout',
  reachability: { entryWhen: true },
  view: {
    template: 'platform/views/session-timeout',
    locals: {
      timedOutService: Query('service'),
      timedOutAuthSource: Query('auth'),
      footerBaseUrl: '/platform',
      hideSessionTimeoutModal: true,
    },
  },
})
