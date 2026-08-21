import { nunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import {
  BlockDefinition,
  ResolvableObject,
  ResolvableString,
  ResolvedPropsOf,
} from '@ministryofjustice/hmpps-forge/core/components'
import { SupervisionPackageDetails, TierCalculation } from '../../effects/types'

/**
 * Renders the MPoP-built supervision package component
 * from @ministryofjustice/hmpps-mpop-frontend-components-lib.
 */
export interface SupervisionPackage extends BlockDefinition {
  /** Person's CRN - the template uses it to build MPoP-side links */
  crn: ResolvableString

  /** Tier calculation loaded by the loadSupervisionPackage effect, or a Data() reference to it */
  tierCalculation: ResolvableObject<TierCalculation> | undefined

  /** Supervision package details loaded by the loadSupervisionPackage effect, or a Data() reference to them */
  supervisionPackageDetails: ResolvableObject<SupervisionPackageDetails> | undefined
}

/**
 * The macro reads the package fields off the top level (params.currentPhase,
 * params.currentYear, params.earlyEngagement, params.nextAppointment), so the
 * frontend context is spread rather than nested under a key.
 *
 * Its link props (arrange appointment, next-appointment, tier history, NDelius)
 * are left unset on purpose: those routes only exist in MPoP, so supplying them
 * would send practitioners out of this service. With no next-appointment href
 * the appointment renders as plain text rather than a link.
 */
export function buildParams(props: ResolvedPropsOf<SupervisionPackage>) {
  const tierCalculation = props.tierCalculation as TierCalculation | undefined
  const supervisionPackageDetails = props.supervisionPackageDetails as SupervisionPackageDetails | undefined

  return {
    tierScore: tierCalculation && tierCalculation.tierScore !== 'MISSING' ? tierCalculation.tierScore : undefined,
    tag: tierCalculation?.tag,
    crn: props.crn,
    ...(supervisionPackageDetails ?? {}),
  }
}

export const SupervisionPackage = nunjucksComponent<SupervisionPackage>('supervisionPackage', {
  render: (props, nunjucksEnv) => {
    const params = buildParams(props)

    return nunjucksEnv.render('mpop/components/supervision-package/template.njk', { params })
  },
})
