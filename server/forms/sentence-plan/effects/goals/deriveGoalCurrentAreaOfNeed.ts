import { SentencePlanContext } from '../types'

/**
 * Derive current area of need data from URL params
 *
 * Reads areasOfNeed from context (set via step's data property).
 * Computes:
 * - currentAreaOfNeed: The full area object matching the URL slug
 * - otherAreasOfNeed: All other areas (for "related areas" checkboxes)
 * - areaOfNeedSlugs: Slugs for all the areas of need
 */
export const deriveGoalCurrentAreaOfNeed = () => async (context: SentencePlanContext) => {
  const slug = context.getRequestParam('areaOfNeed')
  const areasOfNeed = context.getData('areasOfNeed')

  const areaOfNeedSlugs = areasOfNeed.map(areOfNeed => areOfNeed.slug)
  const currentAreaOfNeed = areasOfNeed.find(a => a.slug === slug)
  const otherAreasOfNeed = areasOfNeed.filter(a => a.slug !== slug).sort((a, b) => a.text.localeCompare(b.text))

  context.setData('areaOfNeedSlugs', areaOfNeedSlugs)
  context.setData('currentAreaOfNeed', currentAreaOfNeed)
  context.setData('otherAreasOfNeed', otherAreasOfNeed)
}
