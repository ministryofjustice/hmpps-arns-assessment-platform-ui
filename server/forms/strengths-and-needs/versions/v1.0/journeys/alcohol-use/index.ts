import { Condition, Data, journey, Query } from '@ministryofjustice/hmpps-forge/core/authoring'
import { alcoholUseStep } from './steps/alcohol-use/step'
import { alcoholUseDetailsStep } from './steps/alcohol-use-details/step'
import { alcoholUseSummaryStep } from './steps/alcohol-use-summary/step'
import { alcoholUseAnalysisStep } from './steps/alcohol-use-analysis/step'
import { Section } from '../../constants/section'
import { commonContentFor } from '../../locales'

export const alcoholUseJourney = journey({
  code: Section.alcohol_use.code,
  title: commonContentFor('sectionTitle.alcohol-use'),
  path: Section.alcohol_use.path,
  reachability: { resumeWhen: Query('resume').match(Condition.Equals('true')) },
  view: {
    locals: {
      sectionTitle: commonContentFor('sectionTitle.alcohol-use'),
      sectionStatus: Data(Section.alcohol_use.statusKey),
    },
  },
  steps: [alcoholUseStep, alcoholUseDetailsStep, alcoholUseSummaryStep, alcoholUseAnalysisStep],
})
