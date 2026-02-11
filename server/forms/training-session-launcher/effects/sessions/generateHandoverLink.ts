import config from '../../../../config'
import { CreateHandoverLinkRequest } from '../../../../interfaces/handover-api/request'
import { CriminogenicNeedsData, HandoverSubjectDetails, YesNoNull } from '../../../../interfaces/handover-api/shared'
import { resolveHandoverConfig } from '../../flags/handlers'
import { ScenarioValues } from '../../scenarios'
import { TrainingSessionLauncherContext, TrainingLauncherPreferences, Session, TargetApplication } from '../../types'
import { TrainingSessionLauncherEffectsDeps } from '../types'

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
 * Build CriminogenicNeedsData from session values
 * Only includes needs that have at least one field populated
 */
function buildCriminogenicNeeds(values: ScenarioValues): CriminogenicNeedsData | undefined {
  const needs: CriminogenicNeedsData = {}

  // Accommodation
  if (values.accLinkedToHarm || values.accLinkedToReoffending || values.accStrengths) {
    needs.accommodation = {
      accLinkedToHarm: values.accLinkedToHarm,
      accLinkedToReoffending: values.accLinkedToReoffending,
      accStrengths: values.accStrengths,
      accOtherWeightedScore: values.accOtherWeightedScore,
      accThreshold: values.accThreshold,
    }
  }

  // Education, Training & Employability
  if (values.eteLinkedToHarm || values.eteLinkedToReoffending || values.eteStrengths) {
    needs.educationTrainingEmployability = {
      eteLinkedToHarm: values.eteLinkedToHarm,
      eteLinkedToReoffending: values.eteLinkedToReoffending,
      eteStrengths: values.eteStrengths,
      eteOtherWeightedScore: values.eteOtherWeightedScore,
      eteThreshold: values.eteThreshold,
    }
  }

  // Finance
  if (values.financeLinkedToHarm || values.financeLinkedToReoffending || values.financeStrengths) {
    needs.finance = {
      financeLinkedToHarm: values.financeLinkedToHarm,
      financeLinkedToReoffending: values.financeLinkedToReoffending,
      financeStrengths: values.financeStrengths,
    }
  }

  // Drug Misuse
  if (values.drugLinkedToHarm || values.drugLinkedToReoffending || values.drugStrengths) {
    needs.drugMisuse = {
      drugLinkedToHarm: values.drugLinkedToHarm,
      drugLinkedToReoffending: values.drugLinkedToReoffending,
      drugStrengths: values.drugStrengths,
      drugOtherWeightedScore: values.drugOtherWeightedScore,
      drugThreshold: values.drugThreshold,
    }
  }

  // Alcohol Misuse
  if (values.alcoholLinkedToHarm || values.alcoholLinkedToReoffending || values.alcoholStrengths) {
    needs.alcoholMisuse = {
      alcoholLinkedToHarm: values.alcoholLinkedToHarm,
      alcoholLinkedToReoffending: values.alcoholLinkedToReoffending,
      alcoholStrengths: values.alcoholStrengths,
      alcoholOtherWeightedScore: values.alcoholOtherWeightedScore,
      alcoholThreshold: values.alcoholThreshold,
    }
  }

  // Health & Wellbeing
  if (values.emoLinkedToHarm || values.emoLinkedToReoffending || values.emoStrengths) {
    needs.healthAndWellbeing = {
      emoLinkedToHarm: values.emoLinkedToHarm,
      emoLinkedToReoffending: values.emoLinkedToReoffending,
      emoStrengths: values.emoStrengths,
    }
  }

  // Personal Relationships & Community
  if (values.relLinkedToHarm || values.relLinkedToReoffending || values.relStrengths) {
    needs.personalRelationshipsAndCommunity = {
      relLinkedToHarm: values.relLinkedToHarm,
      relLinkedToReoffending: values.relLinkedToReoffending,
      relStrengths: values.relStrengths,
      relOtherWeightedScore: values.relOtherWeightedScore,
      relThreshold: values.relThreshold,
    }
  }

  // Thinking, Behaviour & Attitudes
  if (values.thinkLinkedToHarm || values.thinkLinkedToReoffending || values.thinkStrengths) {
    needs.thinkingBehaviourAndAttitudes = {
      thinkLinkedToHarm: values.thinkLinkedToHarm,
      thinkLinkedToReoffending: values.thinkLinkedToReoffending,
      thinkStrengths: values.thinkStrengths,
      thinkOtherWeightedScore: values.thinkOtherWeightedScore,
      thinkThreshold: values.thinkThreshold,
    }
  }

  // Lifestyle & Associates
  if (values.lifestyleLinkedToHarm || values.lifestyleLinkedToReoffending || values.lifestyleStrengths) {
    needs.lifestyleAndAssociates = {
      lifestyleLinkedToHarm: values.lifestyleLinkedToHarm,
      lifestyleLinkedToReoffending: values.lifestyleLinkedToReoffending,
      lifestyleStrengths: values.lifestyleStrengths,
      lifestyleOtherWeightedScore: values.lifestyleOtherWeightedScore,
      lifestyleThreshold: values.lifestyleThreshold,
    }
  }

  // Return undefined if no needs populated
  if (Object.keys(needs).length === 0) {
    return undefined
  }

  return needs
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
      returnUrl: `${config.ingressUrl}/training-session-launcher/sessions`,
    },
    subjectDetails: buildSubjectDetails(values),
    oasysAssessmentPk: values.oasysAssessmentPk,
    criminogenicNeedsData: buildCriminogenicNeeds(values),
  }

  // Add version info based on target application
  if (targetApplication === 'strengths-and-needs' && session.sanAssessmentVersion) {
    request.assessmentVersion = session.sanAssessmentVersion
  }

  if (targetApplication === 'sentence-plan' && session.sentencePlanVersion) {
    request.planVersion = session.sentencePlanVersion
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
 * 4. Calls the handover API to create the link
 * 5. Updates the session with the handover link
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

    const response = await deps.handoverApiClient.createHandoverLink(request)

    // Append clientId and any flag-based URL params to the handover link
    const clientId = getClientIdForTarget(targetApplication)
    const finalHandoverLink = appendParamsToLink(response.handoverLink, clientId, handoverConfig.urlParams)

    // Set the link in context for redirect
    context.setData('handoverLink', finalHandoverLink)
  }
