import {access, step} from '@ministryofjustice/hmpps-forge/core/authoring'
import {Step} from "../../constants/step";
import {drugsSummaryAnalysisTab} from "./fields";
import {StrengthsAndNeedsEffects} from "../../../../../../effects";

export const drugUseAnalysisStep = step({
  path: `/${Step.drug_use_analysis.path}`,
  title: 'Drug use analysis',
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.deriveDrugCategories()],
    }),
  ],
  // TODO: Add template for read-only analysis display
  blocks: [drugsSummaryAnalysisTab],
})
