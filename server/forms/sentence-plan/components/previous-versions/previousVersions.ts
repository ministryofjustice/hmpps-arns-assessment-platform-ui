import { block as blockBuilder, ChainableRef } from '@form-engine/form/builders'
import { BlockDefinition, ConditionalString, EvaluatedBlock } from '@form-engine/form/types/structures.type'
import { buildNunjucksComponent } from '@form-engine-express-nunjucks/utils/buildNunjucksComponent'
import type nunjucks from 'nunjucks'
import { PreviousVersionsResponse } from '../../../../interfaces/coordinator-api/previousVersions'
import config from '../../../../config'

/**
 * Props for the PreviousVersions component
 */
export interface PreviousVersionsProps {
  personName: ConditionalString
  previousVersions: PreviousVersionsResponse | ChainableRef
}

/**
 * Previous versions list component.
 *
 * Renders a table listing previous versions of SAN and Sentence Plan.
 */
export interface PreviousVersions extends BlockDefinition, PreviousVersionsProps {
  variant: 'previousVersions'
}

/**
 * Builds the template parameters for previous versions rendering.
 */
function buildParams(block: EvaluatedBlock<PreviousVersions>) {
  return {
    personName: block.personName,
    versions: block.previousVersions,
    sanUrl: config.sanUrl,
    tables: {
      allVersions: {
        tableHeading: 'All versions',
        tagSource: 'planAgreementStatus',
      },
      countersignedVersions: {
        tableHeading: 'Countersigned versions',
        tagSource: 'status',
      },
    },
    tags: {
      countersigned: {
        statuses: ['COUNTERSIGNED', 'DOUBLE_COUNTERSIGNED'],
        text: 'Countersigned',
        classes: 'govuk-tag--turquoise',
      },
      agreed: {
        statuses: ['AGREED'],
        text: 'Plan agreed',
        classes: 'govuk-tag--blue',
      },
    },
  }
}

export const previousVersions = buildNunjucksComponent<PreviousVersions>(
  'previousVersions',
  async (block: EvaluatedBlock<PreviousVersions>, nunjucksEnv: nunjucks.Environment): Promise<string> => {
    const params = buildParams(block)
    return nunjucksEnv.render('sentence-plan/components/previous-versions/table.njk', { params })
  },
)

/**
 * Creates a previous versions list/table.
 * @see PreviousVersions
 */
export function PreviousVersions(props: PreviousVersionsProps): PreviousVersions {
  return blockBuilder<PreviousVersions>({ ...props, variant: 'previousVersions' })
}
