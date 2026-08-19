import { Condition, journey, Query } from '@ministryofjustice/hmpps-forge/core/authoring'
import { alcoholUseStep } from './steps/alcohol-use/step'
import { alcoholUseDetailsStep } from './steps/alcohol-use-details/step'
import { alcoholUseSummaryStep } from './steps/alcohol-use-summary/step'
import { alcoholUseAnalysisStep } from './steps/alcohol-use-analysis/step'
import { Section } from '../../constants/section'
import { sectionPageTitle, sectionStatusTag } from '../../locales'

export const alcoholUseJourney = journey({
  code: Section.alcohol_use.code,
  title: sectionPageTitle(Section.alcohol_use),
  path: Section.alcohol_use.path,
  reachability: { resumeWhen: Query('resume').match(Condition.Equals('true')) },
  view: {
    locals: {
      sectionTitle: sectionPageTitle(Section.alcohol_use),
      sectionStatusTag: sectionStatusTag(Section.alcohol_use),
    },
  },
  steps: [alcoholUseStep, alcoholUseDetailsStep, alcoholUseSummaryStep, alcoholUseAnalysisStep],
})
