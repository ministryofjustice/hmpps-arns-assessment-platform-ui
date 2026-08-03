import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { getOasysEquivalent } from './port/dataMappingService'
import { answersFromAssessment } from './answersFactory'
import { formConfigFromJourney } from './formConfigFactory'
import { formVersion } from '../../versions/v1.0/constants/formVersion'
import { strengthsAndNeedsV1Journey } from '../../versions/v1.0'
import { JourneyDefinition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { InternalServerError } from 'http-errors'

export const persistOasysEquivalent = (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
  const journeys: Record<string, JourneyDefinition> = {
    'v1.0': strengthsAndNeedsV1Journey,
  }

  const assessment = context.getData('assessment')
  const version = assessment.formVersion || formVersion
  const journey = journeys[version]

  if (!journey) {
    throw new InternalServerError(`No journey defined for version ${version}`)
  }

  const oasysEquivalent = getOasysEquivalent(
    answersFromAssessment(assessment),
    formConfigFromJourney(journey),
  )

  // TODO: persist oasysEquivalent
}
