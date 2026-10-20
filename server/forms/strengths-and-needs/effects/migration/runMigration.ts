import { InternalServerError } from 'http-errors'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { unwrapAll, wrapAll } from '../../../../data/aap-api/wrappers'
import { Commands } from '../../../../interfaces/aap-api/command'
import { formVersionOf } from '../../constants/formVersion'
import { sanMigrations } from '../../migration/registry'
import { AssessmentSnapshot, codeOf } from '../../migration/sanMigration'
import { UpdateOasysDataMappingHook } from '../assessment/updateOasysDataMappingHook'

interface ChangedValues {
  added: Record<string, unknown>
  removed: string[]
}

const changesBetween = (before: Record<string, unknown>, after: Record<string, unknown>): ChangedValues => ({
  added: Object.fromEntries(
    Object.entries(after).filter(
      ([code, value]) => value !== undefined && JSON.stringify(value) !== JSON.stringify(before[code]),
    ),
  ),
  removed: Object.keys(before).filter(code => after[code] === undefined),
})

const hasChanges = ({ added, removed }: ChangedValues) => Object.keys(added).length > 0 || removed.length > 0

/**
 * Runs one migration on the stored assessment and saves the result with its
 * new form version in one batch. The API runs a batch in a single transaction,
 * so the assessment never sits on the new version with the old version's answers.
 *
 * `inputCodes` names the answers the migration's page collected, if it asks anything.
 */
export const runMigration =
  (deps: StrengthsAndNeedsEffectsDeps) =>
  async (context: StrengthsAndNeedsContext, migrationCode: string, inputCodes: string[]) => {
    const user = context.getState('user')
    const assessment = context.getData('assessment')
    const migration = sanMigrations.find(candidate => codeOf(candidate) === migrationCode)

    if (migration?.from !== formVersionOf(assessment)) {
      throw new InternalServerError(`Migration ${migrationCode} does not apply to this assessment's form version`)
    }

    // TODO: Collections (victims, drugs) aren't in the snapshot yet, so a migration
    // can't reshape them. Add them once a migration actually needs to touch one.
    const snapshot: AssessmentSnapshot = {
      answers: unwrapAll(assessment.answers),
      properties: unwrapAll(assessment.properties),
    }
    const inputs = Object.fromEntries(inputCodes.map(code => [code, context.getAnswer(code)]))
    const migrated = migration.migrate(snapshot, inputs)
    const answerChanges = changesBetween(snapshot.answers, migrated.answers)
    const propertyChanges = changesBetween(snapshot.properties, migrated.properties)
    // The OASys mapping must read the migrated answers with the new version's field config
    const hooks = [new UpdateOasysDataMappingHook({ ...assessment, formVersion: migration.to })]
    const { assessmentUuid } = assessment
    const commands: Commands[] = [{ type: 'UpdateFormVersionCommand', assessmentUuid, user, version: migration.to }]

    if (hasChanges(answerChanges)) {
      commands.push({
        type: 'UpdateAssessmentAnswersCommand',
        assessmentUuid,
        user,
        added: wrapAll(answerChanges.added),
        removed: answerChanges.removed,
        hooks,
      })
    }

    if (hasChanges(propertyChanges)) {
      commands.push({
        type: 'UpdateAssessmentPropertiesCommand',
        assessmentUuid,
        user,
        added: wrapAll(propertyChanges.added),
        removed: propertyChanges.removed,
        hooks,
      })
    }

    await deps.api.executeCommands(...commands)
  }
