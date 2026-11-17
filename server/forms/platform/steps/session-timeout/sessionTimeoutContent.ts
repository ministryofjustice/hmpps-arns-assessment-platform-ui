export interface SessionTimeoutContent {
  modal: {
    heading: string
    /** `{countdown}` is swapped for the live countdown, e.g. "9 minutes" */
    description: string
    continueButtonText: string
    leaveLinkText: string
  }
  page: {
    title: string
    heading: string
    paragraphs: string[]
    /** Left out when we don't know which service to send the user back to */
    returnButton?: {
      text: string
      href: string
    }
  }
}

/**
 * Keyed by the service key stored in `req.session.targetService` (see `server/forms/access/registry.ts`).
 * A new service gets its own wording by adding an entry here.
 */
const sessionTimeoutContentByService: Record<string, SessionTimeoutContent> = {
  'sentence-plan': {
    modal: {
      heading: 'Your unsaved information will be deleted soon',
      description:
        'We will delete any unsaved information if you do not continue in the next {countdown}. This is to protect your information.',
      continueButtonText: 'Continue using sentence plan',
      leaveLinkText: 'Delete unsaved information',
    },
    page: {
      title: 'Your unsaved information has been deleted - Sentence plan',
      heading: 'Your unsaved information has been deleted',
      paragraphs: ['This is to protect your information.', 'You can go to the plan to start again.'],
      returnButton: {
        text: 'Go to the plan',
        href: '/sentence-plan/v1.0/plan/overview',
      },
    },
  },
  'strengths-and-needs': {
    modal: {
      heading: 'Your session will end soon',
      description:
        'Your information has been saved. We will end your session if you do not continue in the next {countdown}. This is to protect your information.',
      continueButtonText: 'Continue using strengths and needs',
      leaveLinkText: 'End session',
    },
    page: {
      title: 'Your session has ended - Strengths and needs',
      heading: 'Your session has ended',
      paragraphs: [
        'Your information has been saved. This is to protect your information.',
        'You can go to strengths and needs to continue.',
      ],
      returnButton: {
        text: 'Go to strengths and needs',
        href: '/strengths-and-needs',
      },
    },
  },
}

const defaultSessionTimeoutContent: SessionTimeoutContent = {
  modal: {
    heading: 'Your session will end soon',
    description:
      'We will end your session if you do not continue in the next {countdown}. This is to protect your information.',
    continueButtonText: 'Continue',
    leaveLinkText: 'End session',
  },
  page: {
    title: 'Your session has ended - Assess and plan',
    heading: 'Your session has ended',
    paragraphs: ['This is to protect your information.'],
  },
}

/**
 * Takes `unknown` because the service often comes straight from a query string,
 * so it can be missing, an array, or a key we don't know.
 */
export const getSessionTimeoutContent = (service: unknown): SessionTimeoutContent =>
  typeof service === 'string' && Object.hasOwn(sessionTimeoutContentByService, service)
    ? sessionTimeoutContentByService[service]
    : defaultSessionTimeoutContent
