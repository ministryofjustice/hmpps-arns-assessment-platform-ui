import { block as blockBuilder, ChainableRef } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  BlockDefinition,
  EvaluatedBlock,
} from '@ministryofjustice/hmpps-forge/core/components'
import { buildNunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import type nunjucks from 'nunjucks'
import { DataDeletionDataResponse } from '../../../../interfaces/aap-api/dataDeletion';

export interface EditProps {
  currentData: DataDeletionDataResponse | ChainableRef
}

export interface Edit extends BlockDefinition, EditProps {
  variant: 'edit'
}

/**
 * Builds the template parameters for rendering.
 */
function buildParams(block: EvaluatedBlock<Edit>) {
  return {
    currentData: block.currentData,
  }
}

export const edit = buildNunjucksComponent<Edit>(
  'edit',
  (block: EvaluatedBlock<Edit>, nunjucksEnv: nunjucks.Environment): string => {
    const params = buildParams(block)
    return nunjucksEnv.render('data-deletion-tool/components/edit/edit.njk', { params })
  },
)

export function Edit(props: EditProps): Edit {
  return blockBuilder<Edit>({ ...props, variant: 'edit' })
}
