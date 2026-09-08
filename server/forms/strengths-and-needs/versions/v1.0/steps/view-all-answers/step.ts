import { access, Data, Session, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { SanAuditEvent, StrengthsAndNeedsEffects } from '../../../../effects'
import { basePath } from '../../constants/formVersion'
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
        StrengthsAndNeedsEffects.setDynamicBacklink(basePath),
        StrengthsAndNeedsEffects.sendAuditEvent(SanAuditEvent.VIEW_ALL_ANSWERS),
      ],
    }),
  ],
  view: {
    locals: {
      hideNavigation: true,
      hideNavigationLinks: true,
      backlink: Data('dynamicBacklink'),
      viewAllAnswersPage: true,
      practitionerName: Session('practitionerDetails.displayName'),
    },
  },
  blocks: viewAllAnswersBlocks,
})
