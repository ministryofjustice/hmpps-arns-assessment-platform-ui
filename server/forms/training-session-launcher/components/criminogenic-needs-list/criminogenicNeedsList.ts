import type nunjucks from 'nunjucks'
import { block as blockBuilder } from '@form-engine/form/builders'
import {
  BasicBlockProps,
  BlockDefinition,
  ConditionalArray,
  ConditionalString,
  EvaluatedBlock,
} from '@form-engine/form/types/structures.type'
import { buildNunjucksComponent } from '@form-engine-express-nunjucks/utils/buildNunjucksComponent'
import { DisplayNeed } from '../../types'

/**
 * Props for the CriminogenicNeedsList component.
 */
export interface CriminogenicNeedsListProps extends BasicBlockProps {
  /** Array of display-friendly needs to render */
  needs: ConditionalArray<DisplayNeed>

  /** Additional CSS classes */
  classes?: ConditionalString
}

/**
 * CriminogenicNeedsList component interface.
 */
export interface CriminogenicNeedsList extends BlockDefinition, CriminogenicNeedsListProps {
  variant: 'criminogenicNeedsList'
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

/**
 * Renders the CriminogenicNeedsList component
 */
export const criminogenicNeedsList = buildNunjucksComponent<CriminogenicNeedsList>(
  'criminogenicNeedsList',
  async (block: EvaluatedBlock<CriminogenicNeedsList>, nunjucksEnv: nunjucks.Environment) => {
    const needs = (block.needs as DisplayNeed[]) ?? []
    const classes = ['criminogenic-needs-list', block.classes].filter(Boolean).join(' ')

    const templateNeeds = needs.map(transformNeedForTemplate)

    return nunjucksEnv.render('training-session-launcher/components/criminogenic-needs-list/template.njk', {
      params: {
        classes,
        needs: templateNeeds,
      },
    })
  },
)

/**
 * Creates a CriminogenicNeedsList block for displaying criminogenic needs.
 *
 * @example
 * ```typescript
 * CriminogenicNeedsList({
 *   needs: Item().path('displayNeeds'),
 * })
 * ```
 */
export function CriminogenicNeedsList(props: CriminogenicNeedsListProps): CriminogenicNeedsList {
  return blockBuilder<CriminogenicNeedsList>({ ...props, variant: 'criminogenicNeedsList' })
}
