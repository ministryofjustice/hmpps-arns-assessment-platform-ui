import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { Data, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsTransformers } from '../transformers'
import { FormConfig } from '../constants/formConfig'

export const createConfigStep = (formConfig: FormConfig) =>
  step({
    path: `/config`,
    title: 'Config',
    reachability: { entryWhen: true },
    data: { formConfig },
    blocks: [
      HtmlBlock({
        tag: 'pre',
        content: Data('formConfig').pipe(StrengthsAndNeedsTransformers.JsonStringify()),
      }),
    ],
  })
