import { InternalServerError } from 'http-errors'
import { Hook } from '../../../../interfaces/aap-api/command'
import { AssessmentVersionQueryResult } from '../../../../interfaces/aap-api/queryResult'
import { latestVersion } from '../../constants/formVersion'
import { FormConfig } from '../../constants/formConfig'
import { formConfigsByVersion } from '../../constants/formConfigRegistry'

export class UpdateOasysDataMappingHook implements Hook {
  type = 'UpdateOasysDataMapping'

  formConfig: FormConfig

  constructor(assessment: AssessmentVersionQueryResult) {
    const version = assessment.formVersion || latestVersion
    const formConfig = formConfigsByVersion[version]

    if (!formConfig) {
      throw new InternalServerError(`No formConfig defined for version ${version}`)
    }

    this.formConfig = formConfig
  }
}
