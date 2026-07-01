import { block as blockBuilder } from '@ministryofjustice/hmpps-forge/core/authoring'
import { BlockDefinition, EvaluatedBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { buildNunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import type nunjucks from 'nunjucks'

export interface OutdentProps {
  block: BlockDefinition
  outdentBy: number
}

export interface Outdent extends BlockDefinition, OutdentProps {
  variant: 'outdent'
}

const outdentHtml = (str: string, count: number) =>
  str
    .split('\n')
    .map(it => (it.startsWith(' '.repeat(count)) ? it.substring(count) : it))
    .join('\n')

export const outdent = buildNunjucksComponent<Outdent>(
  'outdent',
  (block: EvaluatedBlock<Outdent>, _nunjucksEnv: nunjucks.Environment): string => {
    return outdentHtml(block.block.html, block.outdentBy)
  },
)

export function Outdent(props: OutdentProps): Outdent {
  return blockBuilder<Outdent>({ ...props, variant: 'outdent' })
}
