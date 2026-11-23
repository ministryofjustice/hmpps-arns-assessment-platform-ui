import {
  step,
  submit,
  access,
  redirect,
  Post,
  Data,
  Condition,
  Format,
} from '@ministryofjustice/hmpps-forge/core/authoring'
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
 * Deleting one session or resetting all of them goes through the confirm-remove step first.
 */
export const sessionsStep = step({
  path: '/sessions',
  title: 'Your sessions',
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
        // With no handover link (the API call failed) there is no redirect, so the page renders its error summary
        next: [redirect({ when: Data('handoverLink').match(Condition.IsRequired()), goto: Data('handoverLink') })],
      },
    }),

    submit({
      when: Post('action').match(Condition.Equals('deleteSession')),
      onAlways: {
        next: [redirect({ goto: Format('confirm-remove?item=session&id=%1', Post('trainingSessionId')) })],
      },
    }),

    submit({
      when: Post('action').match(Condition.Equals('resetAllSessions')),
      onAlways: {
        next: [redirect({ goto: 'confirm-remove?item=all-sessions' })],
      },
    }),
  ],
})
