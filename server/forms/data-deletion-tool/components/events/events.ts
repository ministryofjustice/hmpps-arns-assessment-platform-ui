import { block as blockBuilder, ChainableRef } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  BlockDefinition,
  EvaluatedBlock,
} from '@ministryofjustice/hmpps-forge/core/components'
import { buildNunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import type nunjucks from 'nunjucks'
import { EventDTO } from '../../../../interfaces/aap-api/dataModel'

export interface EventsProps {
  events: EventDTO[] | ChainableRef
  postData: Record<string, string> | ChainableRef
}

export interface Events extends BlockDefinition, EventsProps {
  variant: 'events'
}

/**
 * Builds the template parameters for rendering.
 */
function buildParams(block: EvaluatedBlock<Events>) {
  return {
    events: block.events,
    postData: block.postData,
  }
}

export const events = buildNunjucksComponent<Events>(
  'events',
  (block: EvaluatedBlock<Events>, nunjucksEnv: nunjucks.Environment): string => {
    const params = buildParams(block)
    return nunjucksEnv.render('data-deletion-tool/components/events/events.njk', { params })
  },
)

export function Events(props: EventsProps): Events {
  return blockBuilder<Events>({ ...props, variant: 'events' })
}
