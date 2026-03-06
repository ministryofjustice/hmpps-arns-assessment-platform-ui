import { createFormPackage, journey } from '@form-engine/form/builders'
import { accessibilityStep } from './steps/accessibility-policy/step'
import { cookiesPolicyStep } from './steps/cookies-policy/step'
import { privacyPolicyStep } from './steps/privacy-policy/step'

const platformPoliciesJourney = journey({
  code: 'platform-policies',
  title: 'Assess and plan',
  path: '/platform',
  steps: [accessibilityStep, cookiesPolicyStep, privacyPolicyStep],
})

export default createFormPackage({
  journey: platformPoliciesJourney,
})
