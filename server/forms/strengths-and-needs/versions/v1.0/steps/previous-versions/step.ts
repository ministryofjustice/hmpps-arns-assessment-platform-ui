import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../effects'
import { Section } from '../../constants/section'
import { commonContentFor } from '../../locales'
import { leadingParagraph, previousVersionTable } from './fields'

/**
 * Lists previous assessment versions, letting a user pick a historic version to view.
 * Form submission stores the selected version timestamp to session for robust cross-request persistence.
 */
export const previousVersionsStep = step({
  path: '/previous-versions',
  title: commonContentFor('pageTitle.previous_versions'),
  reachability: { entryWhen: true },
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.loadPreviousVersions()],
    }),
  ],
  onSubmission: [
    submit({
      onValid: {
        effects: [StrengthsAndNeedsEffects.selectPreviousVersion()],
        next: [redirect({ goto: Section.accommodation.sideNavHref })],
      },
    }),
  ],
  view: {
    locals: {
      hideNavigation: true,
      hideNavigationLinks: true,
      hidePreviousVersionNotification: true,
      sectionTitle: commonContentFor('pageTitle.previous_versions'),
      backlink: Section.accommodation.sideNavHref,
    },
  },
  blocks: [leadingParagraph, previousVersionTable],
})
