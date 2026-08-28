import { access, Data, step, Session } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../effects'
import { basePath } from '../../constants/formVersion'
import { Section } from '../../constants/section'
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
      effects: [StrengthsAndNeedsEffects.setViewAllAnswersBacklink(basePath, Section.accommodation.sideNavHref)],
    }),
  ],
  view: {
    locals: {
      hideNavigation: true,
      hideNavigationLinks: true,
      backlink: Data('viewAllAnswersBacklink'),
      viewAllAnswersPage: true,
      practitionerName: Session('practitionerDetails.displayName'),
    },
  },
  blocks: viewAllAnswersBlocks,
})
