import nunjucks from 'nunjucks'
import type { ResolvableString, BasicBlockProps, BlockDefinition } from '@ministryofjustice/hmpps-forge/core/components'
import { buildNunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import { block as buildBlock } from '@ministryofjustice/hmpps-forge/core/authoring'
import { RiskData } from '@ministryofjustice/hmpps-arns-frontend-components-lib/dist/types/RiskData'

export interface DetailedRiskPredictorScoresProps extends BasicBlockProps {
  data: RiskData
  forename: ResolvableString
}

export interface DetailedRiskPredictorScores extends BlockDefinition, DetailedRiskPredictorScoresProps {
  variant: 'detailedRiskPredictorScores'
}

export function DetailedRiskPredictorScores(props: DetailedRiskPredictorScoresProps): DetailedRiskPredictorScores {
  return buildBlock<DetailedRiskPredictorScores>({ ...props, variant: 'detailedRiskPredictorScores' })
}

export const detailedRiskPredictorScores = buildNunjucksComponent<DetailedRiskPredictorScores>(
  'detailedRiskPredictorScores',
  block => {
    const params = {
      data: block.data,
      forename: block.forename,
    }

    return nunjucks.render('arns/components/risk-predictor-scores-content/template.njk', { params })
  },
)
