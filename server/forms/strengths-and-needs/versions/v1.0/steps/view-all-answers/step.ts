import { access, Data, step, Session } from '@ministryofjustice/hmpps-forge/core/authoring'
import { SanAuditEvent, StrengthsAndNeedsEffects } from '../../../../effects'
import { basePath, CaseData } from '../../constants/formVersion'
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
      effects: [
        StrengthsAndNeedsEffects.setViewAllAnswersBacklink(basePath, Section.accommodation.sideNavHref),
        StrengthsAndNeedsEffects.sendAuditEvent(SanAuditEvent.VIEW_ALL_ANSWERS),
      ],
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
