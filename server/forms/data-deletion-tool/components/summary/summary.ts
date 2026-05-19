import { block as blockBuilder, ChainableRef } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  BlockDefinition,
  EvaluatedBlock,
} from '@ministryofjustice/hmpps-forge/core/components'
import { buildNunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import type nunjucks from 'nunjucks'
import { DataDeletionDataResponse, DataDeletionRequest } from '../../../../interfaces/aap-api/dataDeletion';

export interface SummaryProps {
  currentData: DataDeletionDataResponse| ChainableRef
  deletionRequest: DataDeletionRequest | ChainableRef
}

export interface Summary extends BlockDefinition, SummaryProps {
  variant: 'summary'
}

/**
 * Builds the template parameters for rendering.
 */
function buildParams(block: EvaluatedBlock<Summary>) {
  return {
    currentData: block.currentData,
    deletionRequest: block.deletionRequest,
  }
}

export const summary = buildNunjucksComponent<Summary>(
  'summary',
  (block: EvaluatedBlock<Summary>, nunjucksEnv: nunjucks.Environment): string => {
    const params = buildParams(block)
    return nunjucksEnv.render('data-deletion-tool/components/summary/summary.njk', { params })
  },
)

export function Summary(props: SummaryProps): Summary {
  return blockBuilder<Summary>({ ...props, variant: 'summary' })
}
