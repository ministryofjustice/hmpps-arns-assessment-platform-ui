import { Condition, Post, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../effects'
import { isEditMode } from './guards'

import { IsUserSubmitted } from './constants/userSubmitted'
import { autosaveAction } from './autosave'

/**
 * Persists the answers a practitioner has typed so far, with no validation or redirects.
 */
export const autoSaveAccommodationSubmit = (stepCode: string) =>
  submit({
    when: Post('action').match(Condition.Equals(autosaveAction)),
    guards: isEditMode,
    validate: false,
    onAlways: {
      effects: [
        StrengthsAndNeedsEffects.saveCurrentAccommodationStepAnswers(true),
        StrengthsAndNeedsEffects.setUserSubmitted(stepCode, IsUserSubmitted.false),
      ],
    },
  })
