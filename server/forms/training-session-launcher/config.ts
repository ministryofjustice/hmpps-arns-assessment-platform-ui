export const trainingSessionLauncherConfig = {
  enabled: (process.env.FORM_TRAINING_SESSION_LAUNCHER_ENABLED ?? 'false') === 'true',
  ingressUrl: process.env.INGRESS_URL ?? 'http://localhost:3000',
  handoverTargets: {
    'sentence-plan': {
      clientId: process.env.SP_HANDOVER_CLIENT_ID ?? 'sentence-plan',
      displayName: 'Sentence Plan',
    },
    'strengths-and-needs': {
      clientId: process.env.SAN_HANDOVER_CLIENT_ID ?? 'strengths-and-needs-assessment',
      displayName: 'Strengths and Needs (SAN)',
    },
    'tiering-assessment': {
      clientId: process.env.TIERING_ASSESSMENT_CLIENT_ID ?? 'tiering-assessment',
      displayName: 'Tiering Assessment',
    },
  },
} as const
