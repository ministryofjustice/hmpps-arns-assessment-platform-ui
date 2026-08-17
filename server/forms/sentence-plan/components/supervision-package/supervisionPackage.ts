import type nunjucks from 'nunjucks'
import { buildNunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import {
  BasicBlockProps,
  BlockDefinition,
  ResolvableObject,
  ResolvableString,
  EvaluatedBlock,
} from '@ministryofjustice/hmpps-forge/core/components'
import { block as blockBuilder } from '@ministryofjustice/hmpps-forge/core/authoring'
import { SupervisionPackageDetails, TierCalculation } from '../../effects/types'

export interface SupervisionPackageProps extends BasicBlockProps {
  /** Person's CRN - the template uses it to build MPoP-side links */
  crn: ResolvableString

  /** Tier calculation loaded by the loadSupervisionPackage effect, or a Data() reference to it */
  tierCalculation: ResolvableObject<TierCalculation> | undefined

  /** Supervision package details loaded by the loadSupervisionPackage effect, or a Data() reference to them */
  supervisionPackageDetails: ResolvableObject<SupervisionPackageDetails> | undefined
}

export interface SupervisionPackageBlock extends BlockDefinition, SupervisionPackageProps {
  variant: 'supervisionPackage'
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
export function buildParams(block: EvaluatedBlock<SupervisionPackageBlock>) {
  const tierCalculation = block.tierCalculation as TierCalculation | undefined
  const supervisionPackageDetails = block.supervisionPackageDetails as SupervisionPackageDetails | undefined

  return {
    tierScore: tierCalculation && tierCalculation.tierScore !== 'MISSING' ? tierCalculation.tierScore : undefined,
    tag: tierCalculation?.tag,
    crn: block.crn,
    ...(supervisionPackageDetails ?? {}),
  }
}

function renderSupervisionPackage(
  block: EvaluatedBlock<SupervisionPackageBlock>,
  nunjucksEnv: nunjucks.Environment,
): string {
  const params = buildParams(block)

  return nunjucksEnv.render('mpop/components/supervision-package/template.njk', { params })
}

export const supervisionPackage = buildNunjucksComponent<SupervisionPackageBlock>(
  'supervisionPackage',
  renderSupervisionPackage,
)

/**
 * Renders the MPoP-built supervision package component
 * from @ministryofjustice/hmpps-mpop-frontend-components-lib.
 */
export function SupervisionPackage(props: SupervisionPackageProps): SupervisionPackageBlock {
  return blockBuilder<SupervisionPackageBlock>({ ...props, variant: 'supervisionPackage' })
}
