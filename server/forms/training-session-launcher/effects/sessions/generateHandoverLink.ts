import config from '../../../../config'
import { CreateHandoverLinkRequest } from '../../../../interfaces/handover-api/request'
import { HandoverSubjectDetails } from '../../../../interfaces/handover-api/shared'
import { resolveHandoverConfig } from '../../flags/handlers'
import { ScenarioValues } from '../../scenarios'
import { TrainingSessionLauncherContext, TrainingLauncherPreferences, Session, TargetApplication } from '../../types'
import { TrainingSessionLauncherEffectsDeps } from '../types'
import { registerTrainingStubs } from './trainingStubs'

/**
 * Get the OAuth client ID for a target application
 */
function getClientIdForTarget(targetApplication: TargetApplication): string {
  return config.handoverTargets[targetApplication].clientId
}

/**
 * Append query parameters to handover link
 */
function appendParamsToLink(handoverLink: string, clientId: string, additionalParams: Record<string, string>): string {
  const url = new URL(handoverLink)
  url.searchParams.set('clientId', clientId)

  for (const [key, value] of Object.entries(additionalParams)) {
    url.searchParams.set(key, value)
  }

  return url.toString()
}

/**
 * Default empty preferences
 */
const DEFAULT_PREFERENCES: TrainingLauncherPreferences = {
  savedScenarios: [],
  sessions: [],
}

/**
 * Build HandoverSubjectDetails from session values
 */
function buildSubjectDetails(values: ScenarioValues): HandoverSubjectDetails {
  const subjectDetails: HandoverSubjectDetails = {
    crn: values.crn,
    givenName: values.givenName,
    familyName: values.familyName,
    gender: values.gender,
    dateOfBirth: values.dateOfBirth,
    location: values.location,
    sexuallyMotivatedOffenceHistory: values.sexuallyMotivatedOffenceHistory,
  }
  if (values.pnc) {
    subjectDetails.pnc = values.pnc
  }
  return subjectDetails
}

/**
 * Build the handover link request from session data
 */
function buildHandoverRequest(session: Session, targetApplication: TargetApplication): CreateHandoverLinkRequest {
  const { values } = session

  const request: CreateHandoverLinkRequest = {
    user: {
      identifier: values.practitionerIdentifier,
      displayName: values.practitionerDisplayName,
      accessMode: values.accessMode,
      planAccessMode: values.planAccessMode,
      returnUrl: `${config.ingressUrl}/training-session-launcher/sessions`,
    },
    subjectDetails: buildSubjectDetails(values),
    oasysAssessmentPk: values.oasysAssessmentPk,
  }

  // Add version info based on target application
  if (targetApplication === 'strengths-and-needs' && session.sanAssessmentVersion) {
    request.assessmentVersion = session.sanAssessmentVersion
  }

  if (targetApplication === 'sentence-plan' && values.sentencePlanVersion) {
    request.sentencePlanVersion = values.sentencePlanVersion
  }

  if (targetApplication === 'tiering-assessment' && session.tieringAssessmentVersion) {
    request.tieringAssessmentVersion = session.tieringAssessmentVersion
  }

  return request
}

/**
 * Generate a handover link for an existing training session.
 *
 * This effect:
 * 1. Gets trainingSessionId and targetApplication from POST data
 * 2. Loads the session from preferences
 * 3. Builds a handover request from session values
 * 4. Registers Wiremock stubs for the scenario's criminogenic needs when "Use mocked criminogenic needs" is ticked,
 *    the scenario has the SAN Private Beta flag, the CRN is a valid CRN that is not a magic CRN, and the ARNS API is
 *    behind Wiremock. When it is not ticked or not Private Beta, removes any stubs an earlier launch left instead
 * 5. Calls the handover API to create the link
 * 6. Sets the link in context data for redirect
 */
export const generateHandoverLink =
  (deps: TrainingSessionLauncherEffectsDeps) => async (context: TrainingSessionLauncherContext) => {
    const preferencesId = context.getState('preferencesId')

    if (!preferencesId) {
      throw new Error('Cannot generate handover link: preferencesId is missing from state')
    }

    const trainingSessionId = context.getPostData('trainingSessionId') as string | undefined
    const targetApplication = (context.getPostData('targetApplication') as TargetApplication) || 'sentence-plan'

    if (!trainingSessionId) {
      throw new Error('Cannot generate handover link: trainingSessionId is missing from POST data')
    }

    // Load session from preferences
    const preferences = await deps.preferencesStore.get<{ trainingLauncher?: TrainingLauncherPreferences }>(
      preferencesId,
    )
    const trainingLauncher = preferences?.trainingLauncher ?? DEFAULT_PREFERENCES
    const session = trainingLauncher.sessions.find(s => s.id === trainingSessionId)

    if (!session) {
      throw new Error(`Cannot generate handover link: session with ID '${trainingSessionId}' not found`)
    }

    // Resolve handover config based on session flags
    const handoverConfig = resolveHandoverConfig(session.flags)

    // Build and send handover request (applying any flag-based modifications)
    const baseRequest = buildHandoverRequest(session, targetApplication)
    const request = handoverConfig.modifyRequest(baseRequest)

    await registerTrainingStubs(deps.wiremockAdminClient, session.values, session.flags)

    const response = await deps.handoverApiClient.createHandoverLink(request)

    // Append clientId and any flag-based URL params to the handover link
    const clientId = getClientIdForTarget(targetApplication)
    const finalHandoverLink = appendParamsToLink(response.handoverLink, clientId, handoverConfig.urlParams)

    // Set the link in context for redirect
    context.setData('handoverLink', finalHandoverLink)
  }
