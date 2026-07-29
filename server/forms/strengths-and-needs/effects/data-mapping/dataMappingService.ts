/**
 * Port of oasys/service/DataMappingService.kt.
 *
 * This package is standalone (no Spring/HTTP dependency), so - unlike the
 * Kotlin service, which fetches FormConfig over HTTP via FormConfigProvider
 * and reads the form version off an AssessmentVersion/AssessmentFormInfo
 * entity pair - callers pass the answers and the resolved FormConfig
 * directly.
 */

import { AnswersProvider } from './common/answersProvider'
import { MappingProvider } from './mappingProvider'
import type { SectionMapping } from './common/sectionMapping'
import type { Answers, OasysEquivalent } from './answers'
import type { FormConfig } from './formConfig'

const mappingProvider = new MappingProvider()

/**
 * `mappings` defaults to the real section mappings registered for
 * `formConfig.version`, but can be overridden (e.g. with test doubles) -
 * this is the seam DataMappingServiceTest.kt used mockk for.
 */
export function getOasysEquivalent(
  answers: Answers,
  formConfig: FormConfig,
  mappings: SectionMapping[] = mappingProvider.get(formConfig.version),
): OasysEquivalent {
  const answersProvider = new AnswersProvider(answers, formConfig)

  return mappings.reduce<OasysEquivalent>(
    (acc, sectionMapping) => ({ ...acc, ...sectionMapping.map(answersProvider) }),
    {},
  )
}
