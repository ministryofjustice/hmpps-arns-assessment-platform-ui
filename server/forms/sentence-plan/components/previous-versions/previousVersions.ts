import {
  BlockDefinition,
  ResolvableBoolean,
  ResolvableObject,
  ResolvableString,
  ResolvedPropsOf,
} from '@ministryofjustice/hmpps-forge/core/components'
import { nunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import { PreviousVersionsResponse } from '../../../../interfaces/coordinator-api/previousVersions'
import config from '../../../../config'

/**
 * Previous versions list component.
 *
 * Renders a table listing previous versions of SAN and Sentence Plan.
 */
export interface PreviousVersions extends BlockDefinition {
  personName: ResolvableString
  previousVersions: ResolvableObject<PreviousVersionsResponse>
  showAssessmentColumn?: ResolvableBoolean
}

/**
 * Builds the template parameters for previous versions rendering.
 */
function buildParams(props: ResolvedPropsOf<PreviousVersions>) {
  return {
    personName: props.personName,
    versions: props.previousVersions,
    showAssessmentColumn: props.showAssessmentColumn ?? true,
    sanUrl: config.sanUrl,
    tables: {
      allVersions: {
        tableHeading: 'All versions',
        tagSource: 'planAgreementStatus',
      },
      countersignedVersions: {
        tableHeading: 'Countersigned versions',
        tagSource: 'status',
      },
    },
    tags: {
      countersigned: {
        statuses: ['COUNTERSIGNED', 'DOUBLE_COUNTERSIGNED'],
        text: 'Countersigned',
        classes: 'govuk-tag--teal',
      },
      agreed: {
        statuses: ['AGREED'],
        text: 'Plan agreed',
        classes: 'govuk-tag--blue',
      },
    },
  }
}

export const PreviousVersions = nunjucksComponent<PreviousVersions>('previousVersions', {
  render: (props, nunjucksEnv) => {
    const params = buildParams(props)

    return nunjucksEnv.render('sentence-plan/components/previous-versions/table.njk', { params })
  },
})
