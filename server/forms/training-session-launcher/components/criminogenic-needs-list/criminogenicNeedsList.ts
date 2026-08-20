import { BlockDefinition, ResolvableArray, ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'
import { nunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import { DisplayNeed } from '../../types'

/**
 * CriminogenicNeedsList component for displaying criminogenic needs.
 *
 * @example
 * ```typescript
 * CriminogenicNeedsList({
 *   needs: Item().path('displayNeeds'),
 * })
 * ```
 */
export interface CriminogenicNeedsList extends BlockDefinition {
  /** Array of display-friendly needs to render */
  needs: ResolvableArray<DisplayNeed>

  /** Additional CSS classes */
  classes?: ResolvableString
}

/**
 * Formats YesNoNullOrNA to display text
 */
function formatYesNo(value: string | undefined): string {
  if (value === 'YES') {
    return 'Yes'
  }

  if (value === 'NO') {
    return 'No'
  }

  return 'Unknown'
}

/**
 * Display-ready need data for the template
 */
interface TemplateNeed {
  name: string
  variant: 'high' | 'low' | 'unknown'
  scoreDisplay: string
  scoreText: string
  thresholdText: string
  linkedToHarmText: string
  linkedToReoffendingText: string
  strengthsText: string
}

/**
 * Transforms a DisplayNeed into template-ready data
 */
function transformNeedForTemplate(need: DisplayNeed): TemplateNeed {
  const hasScore = need.score !== null

  return {
    name: need.name,
    // eslint-disable-next-line no-nested-ternary
    variant: hasScore ? (need.isHighScoring ? 'high' : 'low') : 'unknown',
    scoreDisplay: hasScore ? need.score!.toString() : '?',
    scoreText: hasScore ? need.score!.toString() : 'Not set',
    // eslint-disable-next-line no-nested-ternary
    thresholdText: hasScore ? (need.isHighScoring ? 'Yes' : 'No') : 'Unknown',
    linkedToHarmText: formatYesNo(need.linkedToHarm),
    linkedToReoffendingText: formatYesNo(need.linkedToReoffending),
    strengthsText: formatYesNo(need.strengths),
  }
}

export const CriminogenicNeedsList = nunjucksComponent<CriminogenicNeedsList>('criminogenicNeedsList', {
  render: (props, nunjucksEnv) => {
    const needs = (props.needs as DisplayNeed[]) ?? []
    const classes = ['criminogenic-needs-list', props.classes].filter(Boolean).join(' ')

    const templateNeeds = needs.map(transformNeedForTemplate)

    return nunjucksEnv.render('training-session-launcher/components/criminogenic-needs-list/template.njk', {
      params: {
        classes,
        needs: templateNeeds,
      },
    })
  },
})
