import type { SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import { OasysCreateRequest, OasysCreateResponse } from '../../../../interfaces/coordinator-api/oasysCreate'
import {
  applyCreateSessionModifiers,
  runBeforeCreateSessionHooks,
  runAfterCreateSessionHooks,
} from '../../flags/handlers'
import { TrainingSessionLauncherContext, TrainingLauncherPreferences, Session } from '../../types'
import { TrainingSessionLauncherEffectsDeps, TrainingLauncherNotification } from '../types'
import logger from '../../../../../logger'

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
) {
  // Run before hooks
  await runBeforeCreateSessionHooks(session.flags, deps, context)

  // Call coordinator API
  const coordinatorRequest = buildCoordinatorRequest(session)
  let coordinatorResponse: OasysCreateResponse | undefined

  try {
    coordinatorResponse = await deps.coordinatorApiClient.createOasysAssociation(coordinatorRequest)
  } catch (error) {
    const sanitisedError = error as SanitisedError

    if (sanitisedError.responseStatus === 409) {
      logger.info(
        `OASys association already exists for PK ${coordinatorRequest.oasysAssessmentPk}, continuing without creating new association`,
      )

      // Add notification to inform user that existing association was used
      const userSession = context.getSession()
      userSession.notifications = userSession.notifications || []

      const notification: TrainingLauncherNotification = {
        type: 'information',
        title: 'Using existing assessment data',
        message: `An assessment already exists for OASys PK ${coordinatorRequest.oasysAssessmentPk}. Your session will use the existing association.`,
        target: 'sessions',
      }
      userSession.notifications.push(notification)
    } else {
      throw error
    }
  }

  // Run after hooks
  await runAfterCreateSessionHooks(session.flags, deps, context)

  // Update session in preferences with response IDs (only if we got a response)
  if (coordinatorResponse) {
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
  }

  return coordinatorResponse
}
