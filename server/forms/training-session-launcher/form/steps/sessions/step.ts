import { step, submitTransition, accessTransition, redirect, Post, Data } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import {
  notificationBanners,
  errorBanner,
  pageHeading,
  pageHelpText,
  noSessionsMessage,
  sessionsList,
  sectionBreak,
  newSessionButton,
  resetAllSessionsForm,
} from './fields'
import { TrainingSessionLauncherEffects } from '../../../effects'

/**
 * Sessions Step
 *
 * Displays all active training sessions.
 * Users can generate handover links for each session.
 */
export const sessionsStep = step({
  path: '/sessions',
  title: 'Active Sessions',

  blocks: [
    notificationBanners,
    errorBanner,
    pageHeading,
    pageHelpText,
    noSessionsMessage,
    sessionsList,
    sectionBreak,
    newSessionButton,
    resetAllSessionsForm,
  ],

  onAccess: [
    accessTransition({
      effects: [TrainingSessionLauncherEffects.loadNotifications('sessions')],
    }),
  ],

  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('generateLink')),
      onAlways: {
        effects: [TrainingSessionLauncherEffects.generateHandoverLink()],
        next: [redirect({ goto: Data('handoverLink') })],
      },
    }),

    submitTransition({
      when: Post('action').match(Condition.Equals('deleteSession')),
      onAlways: {
        effects: [TrainingSessionLauncherEffects.deleteSession()],
        next: [redirect({ goto: 'sessions' })],
      },
    }),

    submitTransition({
      when: Post('action').match(Condition.Equals('resetAllSessions')),
      onAlways: {
        effects: [TrainingSessionLauncherEffects.deleteAllSessions()],
        next: [redirect({ goto: 'sessions' })],
      },
    }),
  ],
})
