import {step,} from '@ministryofjustice/hmpps-forge/core/authoring'
import {healthWellbeingAnalysisSummaryTab} from "../health-wellbeing-analysis/fields";

export const healthWellbeingAnalysisStep = step({
  path: '/health-wellbeing-analysis',
  title: 'Health and Wellbeing Analysis',
  blocks: [healthWellbeingAnalysisSummaryTab]
})
