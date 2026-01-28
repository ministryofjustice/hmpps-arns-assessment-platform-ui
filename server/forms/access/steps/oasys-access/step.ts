import { accessTransition, Data, redirect, step } from '@form-engine/form/builders'
import { AccessEffects } from '../../effects'

/**
 * OASys access entry point.
 *
 * Route: /access/:service/oasys
 *
 * Flow:
 * 1. Validate target service and set redirect path
 * 2. Load handover context from API
 * 3. Extract case details, practitioner details, and access details
 * 4. Redirect to target service entry point
 */
export const oasysAccessStep = step({
  path: '/:service/oasys',
  title: 'OASys Access',
  isEntryPoint: true,
  onAccess: [
    accessTransition({
      effects: [
        AccessEffects.setTargetServiceAndRedirect(),
        AccessEffects.loadHandoverContext(),
        AccessEffects.setCaseDetailsFromHandoverContext(),
        AccessEffects.setPractitionerDetailsFromHandoverContext(),
        AccessEffects.setAccessDetailsFromHandoverContext(),
      ],
      next: [redirect({ goto: Data('redirectPath') })],
    }),
  ],
})
