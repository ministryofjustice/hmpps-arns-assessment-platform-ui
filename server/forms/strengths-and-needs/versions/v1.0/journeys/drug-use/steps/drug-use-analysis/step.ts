import { access, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { drugsSummaryAnalysisTab } from './fields'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { analysisPageTitle } from '../../../../locales'
import { Section } from '../../../../constants/section'
import { isReadOnlyMode } from '../../../../guards'

export const drugUseAnalysisStep = step({
  path: `/${Step.drug_use_analysis.path}`,
  title: analysisPageTitle(Section.drug_use),
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.deriveDrugCategories()],
    }),
  ],
  // TODO: Add template for read-only analysis display
  blocks: [drugsSummaryAnalysisTab],
  reachability: { entryWhen: isReadOnlyMode },
})
