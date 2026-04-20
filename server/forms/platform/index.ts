import { createFormPackage, journey } from '@form-engine/form/builders'
import { accessibilityStep } from './steps/accessibility/step'
import { cookiesPolicyStep } from './steps/cookies-policy/step'

const platformPoliciesJourney = journey({
  code: 'platform-policies',
  title: 'Assess and plan',
  path: '/platform',
  steps: [accessibilityStep, cookiesPolicyStep],
})

export default createFormPackage({
  journey: platformPoliciesJourney,
})
