import { Data, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'

/**
 * Shared access predicates for strengths-and-needs steps.
 *
 * Keeping these in one place means each step reads the same rules for:
 * - who came from OASYS
 */

export const isOasysAccess = Data('sessionDetails.accessType').match(Condition.Equals('OASYS'))
