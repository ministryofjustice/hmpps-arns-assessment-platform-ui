import { accessTransition, step } from '@form-engine/form/builders'
import { isOasysAccess } from '../../../../guards'
import { SentencePlanEffects } from '../../../../../../effects'
import { backToTopLink, previousVersions } from './fields'

export const previousVersionsStep = step({
  path: '/previous-versions',
  title: 'Previous versions',
  view: {
    locals: {
      hidePreviousVersions: true,
      headerPageHeading: 'Previous versions',
      buttons: {
        showReturnToOasysButton: isOasysAccess,
      },
    },
  },
  isEntryPoint: true,
  blocks: [previousVersions, backToTopLink],
  onAccess: [
    accessTransition({
      effects: [SentencePlanEffects.loadPreviousVersions()],
    }),
  ],
})
