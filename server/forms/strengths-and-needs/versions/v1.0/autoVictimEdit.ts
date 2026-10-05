import { Condition, Post, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../effects'
import { isEditMode } from './guards'
import { Collection } from '../../constants/collection'
import { IsUserSubmitted } from './constants/section'

/**
 * The `action` value posted by the client side autosave script is 'autosave'.
 */
export const autosaveAction = 'autosave'

/**
 * Persists the answers a practitioner has typed so far, with no validation or redirects.
 */
export const autoSaveVictimEditSubmit = (stepCode: string, victimsCollection: Collection, itemIndex: string | any) =>
  submit({
    when: Post('action').match(Condition.Equals(autosaveAction)),
    guards: isEditMode,
    validate: false,
    onAlways: {
      effects: [
        StrengthsAndNeedsEffects.updateItemFromCollection(victimsCollection, itemIndex, true),
        StrengthsAndNeedsEffects.setUserSubmitted(stepCode, IsUserSubmitted.false),
      ],
    },
  })
