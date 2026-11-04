import {
  UpdateAssessmentAnswersCommand,
  UpdateAssessmentPropertiesCommand,
} from '../../../../interfaces/aap-api/command'
import { sendFormAuditEvent } from '../../../shared'
import { SAN_AUDIT_FORM } from '../../auditEvents'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { UpdateOasysDataMappingHook } from './updateOasysDataMappingHook'

export interface PendingCommand {
  command: UpdateAssessmentAnswersCommand | UpdateAssessmentPropertiesCommand
  /** Re-run the OASys data mapping once this batch is applied */
  mapToOasys?: boolean
  /** Audit event to send only after the batch has been saved */
  audit?: { action: string; details: Record<string, unknown> }
}

/**
 * Hold a command until `commitPendingCommands` runs, so one page submission
 * makes one API round trip instead of one per effect.
 */
export const queueCommand = (context: StrengthsAndNeedsContext, pending: PendingCommand) => {
  context.setData('pendingCommands', [...(context.getData('pendingCommands') ?? []), pending])
}

/**
 * Send every queued command as one transactional batch.
 *
 * Must run after the last queuing effect in an effects list (checked by
 * pendingCommands.test.ts), and before any effect that talks to the API directly.
 */
export const commitPendingCommands =
  (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
    const pending = context.getData('pendingCommands') ?? []

    if (!pending.length) {
      return
    }

    context.setData('pendingCommands', [])

    const commands = pending.map(({ command }) => command)

    // The hook maps the whole assessment, so running it once on the last command
    // covers the batch and keeps the ~87 KB form config out of every other command.
    if (pending.some(({ mapToOasys }) => mapToOasys)) {
      commands[commands.length - 1] = {
        ...commands[commands.length - 1],
        hooks: [new UpdateOasysDataMappingHook(context.getData('assessment'))],
      }
    }

    await deps.api.executeCommands(...commands)

    for (const { audit } of pending) {
      if (audit) {
        // eslint-disable-next-line no-await-in-loop -- Keeps audit events in the order they were queued
        await sendFormAuditEvent(deps.auditService, context, SAN_AUDIT_FORM, audit.action, audit.details)
      }
    }
  }
