export const sentencePlanConfig = {
  enabled: (process.env.FORM_SENTENCE_PLAN_ENABLED ?? 'true') === 'true',
  oasysUrl: process.env.OASYS_URL ?? 'http://localhost:3000/training-session-launcher/sessions',
  oasysReviewUrl: process.env.OASYS_REVIEW_URL ?? 'http://localhost:3000/training-session-launcher/sessions',
  sanUrl: process.env.SAN_URL ?? 'http://localhost:3000',
} as const
