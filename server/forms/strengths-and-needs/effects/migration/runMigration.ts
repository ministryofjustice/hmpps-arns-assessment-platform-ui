import { InternalServerError } from 'http-errors'
import { StrengthsAndNeedsContext } from '../types'
import { unwrapAll, wrapAll } from '../../../../data/aap-api/wrappers'
import { formVersionOf } from '../../constants/formVersion'
import { sanMigrations } from '../../migration/registry'
import { AssessmentSnapshot } from '../../migration/sanMigration'
import { PendingCommand, queueCommands } from '../assessment/pendingCommands'
import { SanAuditEvent } from '../../auditEvents'
import { goLiveDate } from '../../versions/v2.0/constants/formConfig'
import { compareVersions } from '../../migration/mappings'

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
export const runMigration = () => async (context: StrengthsAndNeedsContext) => {
  // const migrationCode = codeOf(v1ToV2Migration)
  const user = context.getState('user')
  const assessment = context.getData('assessment')
  const formVersion = formVersionOf(assessment)
  const maxUpliftVersion = context.getSession().handoverContext.maxUpliftVersion

  const migration = sanMigrations.find(m => m.from === formVersion)

  if (
    !migration ||
    Object.keys(assessment).length === 0 ||
    // Date.parse(assessment.createdAt) > Date.parse(goLiveDate) ||
    !maxUpliftVersion ||
    compareVersions(maxUpliftVersion, formVersion)
  ) {
    return
    // throw new InternalServerError(`Migration ${migrationCode} does not apply to this assessment's form version`)
  }

  // TODO: Collections (victims, drugs) aren't in the snapshot yet, so a migration
  // can't reshape them. Add them once a migration actually needs to touch one.
  const snapshot: AssessmentSnapshot = {
    answers: unwrapAll(assessment.answers),
    properties: unwrapAll(assessment.properties),
  }

  const migrated = migration.migrate(snapshot)
  const answerChanges = changesBetween(snapshot.answers, migrated.answers)
  const propertyChanges = changesBetween(snapshot.properties, migrated.properties)
  const { assessmentUuid } = assessment

  const pendingCommands: PendingCommand[] = [
    {
      command: {
        type: 'UpdateFormVersionCommand',
        assessmentUuid,
        user,
        version: migration.to,
      },
      mapToOasys: false,
      audit: { action: SanAuditEvent.UPDATE_FORM_VERSION, details: {} },
    },
  ]
  const added = propertyChanges.removed
  const removed = propertyChanges.removed

  if (hasChanges(answerChanges)) {
    pendingCommands.push({
      command: {
        type: 'UpdateAssessmentAnswersCommand',
        assessmentUuid,
        user,
        added: wrapAll(added),
        removed,
      },
      mapToOasys: false,
      audit: { action: SanAuditEvent.EDIT_ANSWERS, details: { changedFields: [...removed, ...Object.keys(added)] } },
    })
  }

  if (hasChanges(propertyChanges)) {
    pendingCommands.push({
      command: {
        type: 'UpdateAssessmentPropertiesCommand',
        assessmentUuid,
        user,
        added: wrapAll(added),
        removed,
      },
      mapToOasys: false,
      audit: { action: SanAuditEvent.EDIT_PROPERTIES, details: { changedFields: [...removed, ...Object.keys(added)] } },
    })
  }

  queueCommands(context, pendingCommands)
}
