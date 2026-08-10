import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { getOasysEquivalent } from './port/dataMappingService'
import { answersFromAssessment } from './answersFactory'
import { formConfigFromJourney } from './formConfigFactory'
import { formVersion } from '../../versions/v1.0/constants/formVersion'
import { InternalServerError } from 'http-errors'
import { strengthsAndNeedsRootJourney } from '../../index'
import { wrapAll } from '../../../../data/aap-api/wrappers'

export const persistOasysEquivalent = (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
  const user = context.getState('user')
  const assessment = await deps.api.executeQuery({
    type: 'AssessmentVersionQuery',
    user,
    assessmentIdentifier: context.getSession().sessionDetails.assessmentIdentifier,
  })

  const version = assessment.formVersion || formVersion
  const journey = strengthsAndNeedsRootJourney.children.find((it) => it.data['formVersion'] === version)
  if (!journey) {
    throw new InternalServerError(`No journey defined for version ${version}`)
  }

  const formConfig = formConfigFromJourney(journey)
  const oasysEquivalent = getOasysEquivalent(answersFromAssessment(assessment, formConfig), formConfig)

  await deps.api.executeCommand({
    type: 'UpdateAssessmentPropertiesCommand',
    assessmentUuid: assessment.assessmentUuid,
    user,
    added: wrapAll({ 'oasys_equivalent': JSON.stringify(oasysEquivalent) }),
    removed: [],
  })
}
