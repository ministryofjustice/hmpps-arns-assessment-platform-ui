import { Condition, Data, Session, } from '@ministryofjustice/hmpps-forge/core/authoring'


/**
 * True when the session is NOT in READ_ONLY mode (i.e. the user can edit).
 * Convenience inverse of {@link isReadOnlyMode}.
 */
export const isEditMode = Data('accessMode').not.match(Condition.Equals('READ_ONLY'))
