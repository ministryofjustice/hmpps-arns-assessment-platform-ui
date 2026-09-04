import { access, Data, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../effects'
import { basePath, CaseData } from '../../constants/formVersion'
import { commonContentFor } from '../../locales'
import { viewAllAnswersBlocks } from './fields'

/**
 * Every answer given so far across every section.
 */
export const viewAllAnswersStep = step({
  path: '/view-all-answers',
  title: commonContentFor('pageTitle.view_all_answers'),
  reachability: { entryWhen: true },
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.setDynamicBacklink(basePath)],
    }),
  ],
  view: {
    locals: {
      hideNavigation: true,
      hideNavigationLinks: true,
      sectionTitle: commonContentFor('all_answers_heading', CaseData.ForenamePossessive),
      backlink: Data('dynamicBacklink'),
    },
  },
  blocks: viewAllAnswersBlocks,
})
