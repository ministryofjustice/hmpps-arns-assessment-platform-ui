import { access, Data, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { commonContentFor } from '../../locales'
import { viewAllAnswersBlocks } from './fields'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'

/**
 * Every answer given so far across every section.
 */
export const checkYourAnswersStep = step({
  path: '/check-your-answers',
  title: commonContentFor('pageTitle.check_your_answers'),
  reachability: { entryWhen: true },
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  view: {
    locals: {
      hideNavigation: true,
      hideNavigationLinks: true,
      sectionTitle: commonContentFor('all_answers_heading', CaseData.ForenamePossessive),
      backlink: Data('viewAllAnswersBacklink'),
    },
  },
  blocks: viewAllAnswersBlocks,
})
