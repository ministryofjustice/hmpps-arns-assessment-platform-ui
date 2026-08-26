import { BlockDefinition } from '@ministryofjustice/hmpps-forge/core/components'
import { nunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'

export interface Outdent extends BlockDefinition {
  block: BlockDefinition
  outdentBy: number
}

const outdentHtml = (str: string, count: number) =>
  str
    .split('\n')
    .map(it => (it.startsWith(' '.repeat(count)) ? it.substring(count) : it))
    .join('\n')

export const Outdent = nunjucksComponent<Outdent>('outdent', {
  render: props => outdentHtml(props.block.html, props.outdentBy),
})
