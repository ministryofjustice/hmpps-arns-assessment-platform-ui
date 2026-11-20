import { AssessmentVersionQueryResult } from '../../../interfaces/aap-api/queryResult'

export const latestVersion = 'v2.0'

// The coordinator creates SAN assessments with an empty form version, so an
// unversioned assessment predates versioning and its answers are v1.0's.
const unversionedFormVersion = 'v1.0'

export const formVersionOf = (assessment: AssessmentVersionQueryResult): string =>
  assessment.formVersion || unversionedFormVersion
