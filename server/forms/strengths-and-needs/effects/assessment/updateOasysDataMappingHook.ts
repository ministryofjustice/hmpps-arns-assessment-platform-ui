import { InternalServerError } from 'http-errors'
import { Hook } from '../../../../interfaces/aap-api/command'
import { AssessmentVersionQueryResult } from '../../../../interfaces/aap-api/queryResult'
import { latestVersion } from '../../constants/formVersion'
import { strengthsAndNeedsRootJourney } from '../../index'
import { FormConfig } from '../../constants/formConfig'

export class UpdateOasysDataMappingHook implements Hook {
  type = 'UpdateOasysDataMapping'

  formConfig: FormConfig

  constructor(assessment: AssessmentVersionQueryResult) {
    const version = assessment.formVersion || latestVersion
    const journey = strengthsAndNeedsRootJourney.children.find(it => it.data.formVersion === version)

    if (!journey || !journey.data.formConfig) {
      throw new InternalServerError(`No formConfig defined for version ${version}`)
    }

    this.formConfig = journey.data.formConfig as FormConfig
  }
}
