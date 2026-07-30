import type nunjucks from 'nunjucks'
import { buildNunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import {
  BasicBlockProps,
  BlockDefinition,
  ResolvableString,
  EvaluatedBlock,
} from '@ministryofjustice/hmpps-forge/core/components'
import { ChainableRef, block as blockBuilder } from '@ministryofjustice/hmpps-forge/core/authoring'
import { NextAppointment, SupervisionPackageDetails, TierCalculation } from '../../effects/types'

export interface SupervisionPackageProps extends BasicBlockProps {
  /** Person's forename */
  forename: ResolvableString

  /** Tier calculation loaded by the loadSupervisionPackage effect, or a Data() reference to it */
  tierCalculation: TierCalculation | undefined | ChainableRef

  /** Supervision package details loaded by the loadSupervisionPackage effect, or a Data() reference to them */
  supervisionPackageDetails: SupervisionPackageDetails | undefined | ChainableRef

  /** Next upcoming appointment, or a Data() reference to it */
  nextAppointment: NextAppointment | undefined | ChainableRef
}

export interface SupervisionPackageBlock extends BlockDefinition, SupervisionPackageProps {
  variant: 'supervisionPackage'
}

/**
 * The macro reads the package fields off the top level (params.phase, params.inputs,
 * params.currentYear), so the details are spread rather than nested under a key.
 *
 * Its link props (arrange appointment, tier history, NDelius) are left unset on
 * purpose: those routes only exist in MPoP, so supplying them would send
 * practitioners out of this service.
 */
export function buildParams(block: EvaluatedBlock<SupervisionPackageBlock>) {
  const tierCalculation = block.tierCalculation as TierCalculation | undefined
  const supervisionPackageDetails = block.supervisionPackageDetails as SupervisionPackageDetails | undefined
  const nextAppointment = block.nextAppointment as NextAppointment | undefined

  return {
    tierScore: tierCalculation && tierCalculation.tierScore !== 'MISSING' ? tierCalculation.tierScore : undefined,
    tag: tierCalculation?.tag,
    forename: block.forename,
    nextAppointment,
    ...(supervisionPackageDetails ?? {}),
  }
}

function renderSupervisionPackage(
  block: EvaluatedBlock<SupervisionPackageBlock>,
  nunjucksEnv: nunjucks.Environment,
): string {
  const params = buildParams(block)

  return nunjucksEnv.render('sentence-plan/components/supervision-package/supervisionPackage.njk', { params })
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
