import { access, Data, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../effects'
import { commonContentFor } from '../../locales'
import { backToTopLink, countersignedVersionTable, leadingParagraph, previousVersionTable } from './fields'
import { basePath } from '../../constants/formVersion'

/**
 * Lists previous assessment versions, letting a user pick a historic version to view in a new tab.
 * Links are generated with the version UUID in the URL: /strengths-and-needs/v1.0/view/{versionUuid}
 */
export const previousVersionsStep = step({
  path: '/previous-versions',
  title: commonContentFor('pageTitle.previous_versions'),
  reachability: { entryWhen: true },
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.loadPreviousVersions(), StrengthsAndNeedsEffects.setDynamicBacklink(basePath)],
    }),
  ],
  view: {
    locals: {
      hideNavigation: true,
      hideNavigationLinks: true,
      hidePreviousVersionNotification: true,
      sectionTitle: commonContentFor('pageTitle.previous_versions'),
      backlink: Data('dynamicBacklink'),
    },
  },
  blocks: [leadingParagraph, countersignedVersionTable, previousVersionTable, backToTopLink],
})
