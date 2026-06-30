import { createForgePackage, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { accessibilityStep } from './steps/accessibility/step'
import { cookiesPolicyStep } from './steps/cookies-policy/step'
import { privacyPolicyStep } from './steps/privacy-policy/step'

const platformPoliciesJourney = journey({
  code: 'platform-policies',
  title: 'Assess and plan',
  path: '/platform',
  reachability: { disableReachabilityChecks: true },
  steps: [accessibilityStep, cookiesPolicyStep, privacyPolicyStep],
})

export default createForgePackage({
  journey: platformPoliciesJourney,
})
