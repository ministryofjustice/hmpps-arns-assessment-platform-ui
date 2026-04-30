import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import { InternalServerError } from 'http-errors'
import { unwrapAll } from '../../../../data/aap-api/wrappers'
import { AssessmentVersionQuery } from '../../../../interfaces/aap-api/query'
import { IdentifierType } from '../../../../interfaces/aap-api/identifier'
import { QueryError } from '../../../../errors/aap-api/QueryError'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'

const SAN_ASSESSMENT_TYPE = 'SAN_SP'

const isMissingAssessmentQueryError = (error: unknown): boolean =>
  error instanceof QueryError && error.queryType === 'AssessmentVersionQuery' && error.result === undefined

const isNotFoundApiError = (error: unknown): boolean => error instanceof SanitisedError && error.responseStatus === 404

const loadAssessmentQuery = async (deps: StrengthsAndNeedsEffectsDeps, query: AssessmentVersionQuery) => {
  try {
    return await deps.api.executeQuery(query)
  } catch (error) {
    if (isMissingAssessmentQueryError(error) || isNotFoundApiError(error)) {
      return undefined
    }

    throw error
  }
}

export const loadAssessment = (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
  const user = context.getState('user')
  const session = context.getSession()
  const sessionDetails = session.sessionDetails
  const caseDetails = session.caseDetails

  if (!user) {
    throw new InternalServerError('User is required to load a strengths and needs assessment')
  }

  if (!sessionDetails?.assessmentIdentifier) {
    throw new InternalServerError('Assessment identifier is required in session details')
  }

  const query: AssessmentVersionQuery = {
    type: 'AssessmentVersionQuery',
    user,
    assessmentIdentifier: sessionDetails.assessmentIdentifier,
  }

  let assessment = await loadAssessmentQuery(deps, query)

  if (!assessment) {
    if (!caseDetails?.crn) {
      throw new InternalServerError('CRN is required to create a strengths and needs assessment')
    }

    const formVersion = context.getData('formVersion')

    // TODO: Move SAN assessment creation into coordinator/handover so access arrives with an assessment ID.
    const createResult = await deps.api.executeCommand({
      type: 'CreateAssessmentCommand',
      assessmentType: SAN_ASSESSMENT_TYPE,
      formVersion: typeof formVersion === 'string' ? formVersion : 'v1.0',
      identifiers: {
        [IdentifierType.CRN]: caseDetails.crn,
      },
      user,
    })

    const assessmentIdentifier = {
      type: 'UUID' as const,
      uuid: createResult.assessmentUuid,
    }

    session.sessionDetails = {
      ...sessionDetails,
      assessmentIdentifier,
      assessmentVersion: undefined,
    }

    if (session.handoverContext) {
      session.handoverContext = {
        ...session.handoverContext,
        assessmentContext: {
          ...session.handoverContext.assessmentContext,
          assessmentId: createResult.assessmentUuid,
          assessmentVersion: undefined,
        },
      }
    }

    assessment = await deps.api.executeQuery({
      type: 'AssessmentVersionQuery',
      user,
      assessmentIdentifier: session.sessionDetails.assessmentIdentifier,
    })
  }

  context.setData('assessment', assessment)
  context.setData('assessmentUuid', assessment.assessmentUuid)
  context.setData('sessionDetails', session.sessionDetails)

  const answers = unwrapAll<Record<string, unknown>>(assessment.answers)

  Object.entries(answers).forEach(([code, value]) => {
    context.setAnswer(code, value)
  })
}
