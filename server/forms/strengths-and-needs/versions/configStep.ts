import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { Data, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsTransformers } from '../transformers'

export const configStep = step({
  path: `/config`,
  title: 'Config',
  reachability: { entryWhen: true },
  blocks: [
    HtmlBlock({
      tag: 'pre',
      content: Data('formConfig').pipe(StrengthsAndNeedsTransformers.JsonStringify()),
    }),
  ],
})
