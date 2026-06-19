import {step,} from '@ministryofjustice/hmpps-forge/core/authoring'
import {healthWellbeingAnalysisSummaryTab} from "../health-wellbeing-analysis/fields";
import {Step} from "../../constants/step";

export const healthWellbeingAnalysisStep = step({
  path: `/${Step.health_wellbeing_analysis.path}`,
  title: 'Health and Wellbeing Analysis',
  blocks: [healthWellbeingAnalysisSummaryTab]
})
