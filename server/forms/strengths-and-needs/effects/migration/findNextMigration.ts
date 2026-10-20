import { StrengthsAndNeedsContext } from '../types'
import { formVersionOf } from '../../constants/formVersion'
import { sanMigrations } from '../../migration/registry'
import { codeOf, migrationPath } from '../../migration/sanMigration'

/**
 * Works out which form version the loaded assessment is on, and the page of
 * the migration that moves it on from there, if there is one. Reads only, so it
 * is safe to run on every request.
 */
export const findNextMigration = () => (context: StrengthsAndNeedsContext) => {
  const assessmentFormVersion = formVersionOf(context.getData('assessment'))
  const nextMigration = sanMigrations.find(migration => migration.from === assessmentFormVersion)

  context.setData('assessmentFormVersion', assessmentFormVersion)

  if (nextMigration) {
    context.setData('nextMigrationPath', `${migrationPath}/${codeOf(nextMigration)}`)
  }
}
