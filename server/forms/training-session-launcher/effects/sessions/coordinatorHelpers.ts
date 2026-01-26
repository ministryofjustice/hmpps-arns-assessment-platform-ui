import { OasysCreateRequest, OasysCreateResponse } from '../../../../interfaces/coordinator-api/oasysCreate'
import {
  applyCreateSessionModifiers,
  runBeforeCreateSessionHooks,
  runAfterCreateSessionHooks,
} from '../../flags/handlers'
import { TrainingSessionLauncherContext, TrainingLauncherPreferences, Session } from '../../types'
import { TrainingSessionLauncherEffectsDeps } from '../types'

/**
 * Default empty preferences
 */
const DEFAULT_PREFERENCES: TrainingLauncherPreferences = {
  savedScenarios: [],
  sessions: [],
}

/**
 * Build coordinator API request from session data
 */
export function buildCoordinatorRequest(session: Session): OasysCreateRequest {
  const { values, flags } = session

  const baseRequest: OasysCreateRequest = {
    oasysAssessmentPk: values.oasysAssessmentPk,
    planType: 'INITIAL',
    assessmentType: 'SAN_SP',
    userDetails: {
      id: values.practitionerIdentifier,
      name: values.practitionerDisplayName,
      location: values.location,
    },
    subjectDetails: {
      crn: values.crn,
    },
    newPeriodOfSupervision: 'N',
  }

  return applyCreateSessionModifiers(flags, baseRequest)
}

/**
 * Create session in coordinator API and update preferences with response.
 *
 * This helper:
 * 1. Runs beforeCreateSession hooks
 * 2. Calls coordinator API to create the OASys association
 * 3. Runs afterCreateSession hooks
 * 4. Updates the session in preferences with response IDs
 */
export async function createInCoordinatorAndUpdatePreferences(
  deps: TrainingSessionLauncherEffectsDeps,
  context: TrainingSessionLauncherContext,
  session: Session,
  preferencesId: string,
): Promise<OasysCreateResponse> {
  // Run before hooks
  await runBeforeCreateSessionHooks(session.flags, deps, context)

  // Call coordinator API
  const coordinatorRequest = buildCoordinatorRequest(session)
  const coordinatorResponse = await deps.coordinatorApiClient.createOasysAssociation(coordinatorRequest)

  // Run after hooks
  await runAfterCreateSessionHooks(session.flags, deps, context)

  // Update session in preferences with response IDs
  await deps.preferencesStore.update<{ trainingLauncher?: TrainingLauncherPreferences }>(preferencesId, current => {
    const trainingLauncher = current?.trainingLauncher ?? DEFAULT_PREFERENCES

    const updatedSessions = trainingLauncher.sessions.map(s => {
      if (s.id === session.id) {
        return {
          ...s,
          sanAssessmentId: coordinatorResponse.sanAssessmentId,
          sanAssessmentVersion: coordinatorResponse.sanAssessmentVersion,
          sentencePlanId: coordinatorResponse.sentencePlanId,
          sentencePlanVersion: coordinatorResponse.sentencePlanVersion,
        }
      }

      return s
    })

    return {
      ...current,
      trainingLauncher: {
        ...trainingLauncher,
        sessions: updatedSessions,
      },
    }
  })

  return coordinatorResponse
}
