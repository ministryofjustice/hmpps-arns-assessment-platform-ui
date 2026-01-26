import { accessTransition, Data, redirect, step } from '@form-engine/form/builders'
import { AccessEffects } from '../../effects'

/**
 * CRN access entry point.
 *
 * Route: /forms/access/:service/crn/:crn
 *
 * Flow:
 * 1. Validate target service and set redirect path
 * 2. Load case details from Delius by CRN
 * 3. Set practitioner details from HMPPS auth
 * 4. Set access details for CRN-based access
 * 5. Redirect to target service entry point
 */
export const crnAccessStep = step({
  path: '/:service/crn/:crn',
  title: 'CRN Access',
  isEntryPoint: true,
  onAccess: [
    accessTransition({
      effects: [
        AccessEffects.setTargetServiceAndRedirect(),
        AccessEffects.setCaseDetailsFromCrn(),
        AccessEffects.setPractitionerDetailsFromAuth(),
        AccessEffects.setAccessDetailsForCrn(),
      ],
      next: [redirect({ goto: Data('redirectPath') })],
    }),
  ],
})
