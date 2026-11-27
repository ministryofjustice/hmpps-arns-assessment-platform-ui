import { access, Condition, Data, redirect } from '@ministryofjustice/hmpps-forge/core/authoring'
import { migrationPath } from './sanMigration'

/**
 * Sends anyone on a migration's page back to the migration index unless that
 * migration is the next one due, so a migration never runs out of order or twice.
 */
export const onlyWhenNextMigration = (migrationCode: string) =>
  access({
    when: Data('nextMigrationPath').not.match(Condition.Equals(`${migrationPath}/${migrationCode}`)),
    next: [redirect({ goto: migrationPath })],
  })
