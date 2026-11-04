import ArnsNeedsStubBuilder from './ArnsNeedsStubBuilder'
import { PartialScenarioValues } from '../../scenarios'
import { AssessmentNeedsDto } from '../../../../interfaces/arns-api/assessmentNeeds'
import { AssessmentNeedsDetailsDto } from '../../../../interfaces/arns-api/assessmentNeedsDetails'

describe('ArnsNeedsStubBuilder', () => {
  describe('build()', () => {
    it('should return no stubs when no criminogenic needs are populated', () => {
      const values: PartialScenarioValues = {}

      const stubs = ArnsNeedsStubBuilder.build('X123456', values)

      expect(stubs).toEqual([])
    })

    it('should stub both ARNS needs endpoints for the CRN', () => {
      const values: PartialScenarioValues = { accOtherWeightedScore: '4' }

      const stubs = ArnsNeedsStubBuilder.build('X123456', values)

      expect(stubs.map(stub => stub.request.urlPath)).toEqual([
        '/arns-api/needs/crn/X123456',
        '/arns-api/needs/X123456',
      ])
      expect(stubs.every(stub => stub.priority === 1)).toBe(true)
    })

    it('should give the same stub ids when built again for the same CRN', () => {
      const values: PartialScenarioValues = { accOtherWeightedScore: '4' }

      const first = ArnsNeedsStubBuilder.build('X123456', values)
      const second = ArnsNeedsStubBuilder.build('X123456', values)
      const other = ArnsNeedsStubBuilder.build('X654321', values)

      expect(second.map(stub => stub.id)).toEqual(first.map(stub => stub.id))
      expect(other.map(stub => stub.id)).not.toEqual(first.map(stub => stub.id))
      expect(first[0].id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-8[0-9a-f]{3}-[0-9a-f]{12}$/)
    })

    it('should map launcher values to the assessment endpoint buckets', () => {
      const values: PartialScenarioValues = {
        accLinkedToHarm: 'YES',
        accLinkedToReoffending: 'NO',
        accOtherWeightedScore: '6',
        accThreshold: 'YES',
        drugLinkedToHarm: 'NO',
        drugOtherWeightedScore: '1',
        drugThreshold: 'NO',
        alcoholOtherWeightedScore: '2',
      }

      const [assessmentStub] = ArnsNeedsStubBuilder.build('X123456', values)

      const body = assessmentStub.response.jsonBody as AssessmentNeedsDto
      expect(body.assessmentVersion).toBe('SAN')
      expect(body.identifiedNeeds).toEqual([
        { section: 'ACCOMMODATION', name: 'Accommodation', riskOfHarm: true, riskOfReoffending: false, score: 6 },
      ])
      expect(body.notIdentifiedNeeds).toEqual([
        { section: 'DRUG_USE', name: 'Drug use', riskOfHarm: false, riskOfReoffending: undefined, score: 1 },
      ])
      expect(body.unansweredNeeds).toEqual([
        { section: 'ALCOHOL_USE', name: 'Alcohol use', riskOfHarm: undefined, riskOfReoffending: undefined, score: 2 },
      ])
    })

    it('should leave Finance and Health and wellbeing out of the assessment endpoint', () => {
      const values: PartialScenarioValues = {
        financeLinkedToHarm: 'YES',
        emoLinkedToReoffending: 'YES',
      }

      const [assessmentStub] = ArnsNeedsStubBuilder.build('X123456', values)

      const body = assessmentStub.response.jsonBody as AssessmentNeedsDto
      expect([...body.identifiedNeeds, ...body.notIdentifiedNeeds, ...body.unansweredNeeds]).toEqual([])
    })

    it('should include every populated area, with a need status, in the integration endpoint', () => {
      const values: PartialScenarioValues = {
        accOtherWeightedScore: '6',
        accThreshold: 'YES',
        financeLinkedToHarm: 'YES',
      }

      const [, integrationStub] = ArnsNeedsStubBuilder.build('X123456', values)

      const body = integrationStub.response.jsonBody as AssessmentNeedsDetailsDto
      expect(body.needs).toEqual([
        {
          section: 'ACCOMMODATION',
          name: 'Accommodation',
          needStatus: 'IDENTIFIED_NEED',
          riskOfHarm: undefined,
          riskOfReoffending: undefined,
          score: 6,
        },
        {
          section: 'FINANCE',
          name: 'Finance',
          needStatus: 'UNANSWERED_NEED',
          riskOfHarm: true,
          riskOfReoffending: undefined,
          score: undefined,
        },
      ])
    })

    it('should leave linked to harm and reoffending out when they are unanswered', () => {
      // Arrange
      const values: PartialScenarioValues = {
        accLinkedToHarm: 'NULL',
        accOtherWeightedScore: '3',
      }

      const [, integrationStub] = ArnsNeedsStubBuilder.build('X123456', values)

      const [need] = (integrationStub.response.jsonBody as AssessmentNeedsDetailsDto).needs
      expect(need.riskOfHarm).toBeUndefined()
      expect(need.riskOfReoffending).toBeUndefined()
    })

    it('should leave the score undefined when the launcher score is not a number', () => {
      const values: PartialScenarioValues = { accLinkedToHarm: 'YES', accOtherWeightedScore: 'abc' }

      const [, integrationStub] = ArnsNeedsStubBuilder.build('X123456', values)

      const [need] = (integrationStub.response.jsonBody as AssessmentNeedsDetailsDto).needs
      expect(need.score).toBeUndefined()
    })

    it('should leave the score undefined when the launcher score is blank', () => {
      const values: PartialScenarioValues = { accLinkedToHarm: 'YES', accOtherWeightedScore: '' }

      const [assessmentStub] = ArnsNeedsStubBuilder.build('X123456', values)

      const body = assessmentStub.response.jsonBody as AssessmentNeedsDto
      expect(body.unansweredNeeds[0].score).toBeUndefined()
    })
  })
})
