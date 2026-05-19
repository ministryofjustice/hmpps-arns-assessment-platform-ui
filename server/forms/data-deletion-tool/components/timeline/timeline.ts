import { block as blockBuilder, ChainableRef } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  BlockDefinition,
  EvaluatedBlock,
} from '@ministryofjustice/hmpps-forge/core/components'
import { buildNunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import type nunjucks from 'nunjucks'
import { TimelineItem } from '../../../../interfaces/aap-api/dataModel'

export interface TimelineProps {
  timeline: TimelineItem[] | ChainableRef
  postData: Record<string, string> | ChainableRef
}

export interface Timeline extends BlockDefinition, TimelineProps {
  variant: 'timeline'
}

/**
 * Builds the template parameters for rendering.
 */
function buildParams(block: EvaluatedBlock<Timeline>) {
  return {
    timeline: block.timeline,
    postData: block.postData,
  }
}

export const timeline = buildNunjucksComponent<Timeline>(
  'timeline',
  (block: EvaluatedBlock<Timeline>, nunjucksEnv: nunjucks.Environment): string => {
    const params = buildParams(block)
    return nunjucksEnv.render('data-deletion-tool/components/timeline/timeline.njk', { params })
  },
)

export function Timeline(props: TimelineProps): Timeline {
  return blockBuilder<Timeline>({ ...props, variant: 'timeline' })
}
