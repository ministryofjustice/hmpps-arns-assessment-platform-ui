import { step, submit, access, redirect, Post, Data, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
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
  reachability: { entryWhen: true },

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
    access({
      effects: [TrainingSessionLauncherEffects.loadNotifications('sessions')],
    }),
  ],

  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('generateLink')),
      onAlways: {
        effects: [TrainingSessionLauncherEffects.generateHandoverLink()],
        next: [redirect({ goto: Data('handoverLink') })],
      },
    }),

    submit({
      when: Post('action').match(Condition.Equals('deleteSession')),
      onAlways: {
        effects: [TrainingSessionLauncherEffects.deleteSession()],
        next: [redirect({ goto: 'sessions' })],
      },
    }),

    submit({
      when: Post('action').match(Condition.Equals('resetAllSessions')),
      onAlways: {
        effects: [TrainingSessionLauncherEffects.deleteAllSessions()],
        next: [redirect({ goto: 'sessions' })],
      },
    }),
  ],
})
