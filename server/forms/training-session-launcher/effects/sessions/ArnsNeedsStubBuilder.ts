import { WiremockStubMapping } from '../../../../data/wiremockAdminClient'
import { AssessmentNeedDto, AssessmentNeedsDto } from '../../../../interfaces/arns-api/assessmentNeeds'
import {
  AssessmentNeedDetailDto,
  AssessmentNeedsDetailsDto,
  NeedStatus,
} from '../../../../interfaces/arns-api/assessmentNeedsDetails'
import { PartialScenarioValues } from '../../scenarios'
import config from '../../../../config'
import { createWiremockStub } from './wiremockStubMapping'

interface AreaValues {
  linkedToHarm?: string
  linkedToReoffending?: string
  score?: string
  threshold?: string
}

interface NeedArea {
  section: string
  name: string
  // The assessment endpoint (MPoP) serves SAN sections only, so Finance and Health and wellbeing are integration-only
  isSanSection: boolean
  readValues: (values: PartialScenarioValues) => AreaValues
}

interface StatusedNeed {
  needStatus: NeedStatus
  need: AssessmentNeedDto
  isSanSection: boolean
}

const needAreas: NeedArea[] = [
  {
    section: 'ACCOMMODATION',
    name: 'Accommodation',
    isSanSection: true,
    readValues: values => ({
      linkedToHarm: values.accLinkedToHarm,
      linkedToReoffending: values.accLinkedToReoffending,
      score: values.accOtherWeightedScore,
      threshold: values.accThreshold,
    }),
  },
  {
    section: 'EMPLOYMENT_AND_EDUCATION',
    name: 'Employment and education',
    isSanSection: true,
    readValues: values => ({
      linkedToHarm: values.eteLinkedToHarm,
      linkedToReoffending: values.eteLinkedToReoffending,
      score: values.eteOtherWeightedScore,
      threshold: values.eteThreshold,
    }),
  },
  {
    section: 'FINANCE',
    name: 'Finance',
    isSanSection: false,
    readValues: values => ({
      linkedToHarm: values.financeLinkedToHarm,
      linkedToReoffending: values.financeLinkedToReoffending,
    }),
  },
  {
    section: 'DRUG_USE',
    name: 'Drug use',
    isSanSection: true,
    readValues: values => ({
      linkedToHarm: values.drugLinkedToHarm,
      linkedToReoffending: values.drugLinkedToReoffending,
      score: values.drugOtherWeightedScore,
      threshold: values.drugThreshold,
    }),
  },
  {
    section: 'ALCOHOL_USE',
    name: 'Alcohol use',
    isSanSection: true,
    readValues: values => ({
      linkedToHarm: values.alcoholLinkedToHarm,
      linkedToReoffending: values.alcoholLinkedToReoffending,
      score: values.alcoholOtherWeightedScore,
      threshold: values.alcoholThreshold,
    }),
  },
  {
    section: 'HEALTH_AND_WELLBEING',
    name: 'Health and wellbeing',
    isSanSection: false,
    readValues: values => ({
      linkedToHarm: values.emoLinkedToHarm,
      linkedToReoffending: values.emoLinkedToReoffending,
    }),
  },
  {
    section: 'PERSONAL_RELATIONSHIPS_AND_COMMUNITY',
    name: 'Personal relationships and community',
    isSanSection: true,
    readValues: values => ({
      linkedToHarm: values.relLinkedToHarm,
      linkedToReoffending: values.relLinkedToReoffending,
      score: values.relOtherWeightedScore,
      threshold: values.relThreshold,
    }),
  },
  {
    section: 'THINKING_ATTITUDES_AND_BEHAVIOUR',
    name: 'Thinking, behaviours and attitudes',
    isSanSection: true,
    readValues: values => ({
      linkedToHarm: values.thinkLinkedToHarm,
      linkedToReoffending: values.thinkLinkedToReoffending,
      score: values.thinkOtherWeightedScore,
      threshold: values.thinkThreshold,
    }),
  },
  {
    section: 'LIFESTYLE_AND_ASSOCIATES',
    name: 'Lifestyle and associates',
    isSanSection: true,
    readValues: values => ({
      linkedToHarm: values.lifestyleLinkedToHarm,
      linkedToReoffending: values.lifestyleLinkedToReoffending,
      score: values.lifestyleOtherWeightedScore,
      threshold: values.lifestyleThreshold,
    }),
  },
]

/**
 * Turns the criminogenic needs entered in the training launcher into Wiremock stubs for the two
 * ARNS needs endpoints, so the UI reads the launcher's values through its normal ARNS API path.
 *
 * Returns no stubs when the launcher has no needs populated, which leaves the CRN to fall through
 * to the real ARNS API.
 */
export default class ArnsNeedsStubBuilder {
  // The paths this builder stubs for a CRN, also used to remove its stubs when a session is deleted
  static urlPaths(crn: string): [string, string] {
    const prefix = config.stubbedApis.arnsApi.stubPrefix

    return [`${prefix}/needs/crn/${crn}`, `${prefix}/needs/${crn}`]
  }

  static build(crn: string, values: PartialScenarioValues): WiremockStubMapping[] {
    const statusedNeeds = needAreas.flatMap(area => ArnsNeedsStubBuilder.toStatusedNeed(area, values))

    if (statusedNeeds.length === 0) {
      return []
    }

    const assessedOn = new Date().toISOString()
    const [assessmentPath, integrationPath] = ArnsNeedsStubBuilder.urlPaths(crn)

    return [
      createWiremockStub(assessmentPath, 200, ArnsNeedsStubBuilder.toAssessmentNeeds(statusedNeeds, assessedOn)),
      createWiremockStub(
        integrationPath,
        200,
        ArnsNeedsStubBuilder.toAssessmentNeedsDetails(statusedNeeds, assessedOn),
      ),
    ]
  }

  private static toStatusedNeed(area: NeedArea, values: PartialScenarioValues): StatusedNeed[] {
    const { linkedToHarm, linkedToReoffending, score, threshold } = area.readValues(values)

    if ([linkedToHarm, linkedToReoffending, score, threshold].every(value => value === undefined || value === '')) {
      return []
    }

    return [
      {
        needStatus: ArnsNeedsStubBuilder.toNeedStatus(threshold),
        isSanSection: area.isSanSection,
        need: {
          section: area.section,
          name: area.name,
          riskOfHarm: ArnsNeedsStubBuilder.toLinked(linkedToHarm),
          riskOfReoffending: ArnsNeedsStubBuilder.toLinked(linkedToReoffending),
          score: ArnsNeedsStubBuilder.toScore(score),
        },
      },
    ]
  }

  // Left out unless answered, as real ARNS sends no value for an unanswered question, which the UI shows as unanswered
  private static toLinked(value: string | undefined): boolean | undefined {
    if (value === 'YES') {
      return true
    }

    if (value === 'NO') {
      return false
    }

    return undefined
  }

  private static toScore(value: string | undefined): number | undefined {
    const score = value ? Number(value) : Number.NaN

    return Number.isFinite(score) ? score : undefined
  }

  private static toNeedStatus(threshold: string | undefined): NeedStatus {
    if (threshold === 'YES') {
      return 'IDENTIFIED_NEED'
    }

    if (threshold === 'NO') {
      return 'NOT_IDENTIFIED_NEED'
    }

    return 'UNANSWERED_NEED'
  }

  private static toAssessmentNeeds(statusedNeeds: StatusedNeed[], assessedOn: string): AssessmentNeedsDto {
    const sanNeeds = statusedNeeds.filter(({ isSanSection }) => isSanSection)
    const needsWithStatus = (needStatus: NeedStatus): AssessmentNeedDto[] =>
      sanNeeds.filter(sanNeed => sanNeed.needStatus === needStatus).map(({ need }) => need)

    return {
      assessmentVersion: 'SAN',
      assessedOn,
      identifiedNeeds: needsWithStatus('IDENTIFIED_NEED'),
      notIdentifiedNeeds: needsWithStatus('NOT_IDENTIFIED_NEED'),
      unansweredNeeds: needsWithStatus('UNANSWERED_NEED'),
    }
  }

  private static toAssessmentNeedsDetails(
    statusedNeeds: StatusedNeed[],
    assessedOn: string,
  ): AssessmentNeedsDetailsDto {
    return {
      assessmentVersion: 'SAN',
      assessedOn,
      needs: statusedNeeds.map(({ need, needStatus }): AssessmentNeedDetailDto => ({ ...need, needStatus })),
    }
  }
}
