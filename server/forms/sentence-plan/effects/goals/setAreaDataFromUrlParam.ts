import { AreaOfNeed, SentencePlanContext } from '../types'
import { deriveAreasOfNeedData } from './goalUtils'

/**
 * Set area of need data from URL param
 *
 * Reads the `areaOfNeed` URL param and derives:
 * - currentAreaOfNeed: The full area object matching the URL slug
 * - otherAreasOfNeed: All other areas sorted alphabetically (for "related areas" checkboxes)
 * - areaOfNeedSlugs: Slugs for all areas of need
 *
 * Used on pages where the area comes from the URL (e.g., add-goal).
 */
export const setAreaDataFromUrlParam = () => async (context: SentencePlanContext) => {
  const slug = context.getRequestParam('areaOfNeed')
  const areasOfNeed = context.getData('areasOfNeed') as AreaOfNeed[]

  if (!areasOfNeed || !slug) {
    return
  }

  const { currentAreaOfNeed, otherAreasOfNeed, areaOfNeedSlugs } = deriveAreasOfNeedData(areasOfNeed, slug)

  context.setData('areaOfNeedSlugs', areaOfNeedSlugs)
  context.setData('currentAreaOfNeed', currentAreaOfNeed)
  context.setData('otherAreasOfNeed', otherAreasOfNeed)
}
