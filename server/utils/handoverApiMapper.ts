import {
  CriminogenicNeedsData as HandoverCriminogenicNeedsData,
  YesNoNullOrNA,
} from '../interfaces/handover-api/shared'
import {
  CriminogenicNeedsData as InternalCriminogenicNeedsData,
  CriminogenicNeedArea,
} from '../interfaces/coordinator-api/entityAssessment'
import { areasOfNeed } from '../forms/sentence-plan/versions/v1.0/constants'

interface AreaMapping {
  internalKey: keyof InternalCriminogenicNeedsData
  handoverKey: keyof HandoverCriminogenicNeedsData
  harmKey: string
  reoffendingKey: string
  strengthsKey: string
  scoreKey: string
}

/**
 * Derives handover API field mappings from areasOfNeed configuration.
 * Field names follow the pattern: {prefix}LinkedToHarm, {prefix}LinkedToReoffending, etc.
 */
const areaMappings: AreaMapping[] = areasOfNeed.map(area => ({
  internalKey: area.crimNeedsKey,
  handoverKey: area.crimNeedsKey as keyof HandoverCriminogenicNeedsData,
  harmKey: `${area.handoverPrefix}LinkedToHarm`,
  reoffendingKey: `${area.handoverPrefix}LinkedToReoffending`,
  strengthsKey: `${area.handoverPrefix}Strengths`,
  scoreKey: `${area.handoverPrefix}OtherWeightedScore`,
}))

function yesNoToBoolean(value: YesNoNullOrNA | undefined): boolean | null {
  if (value === 'YES') return true
  if (value === 'NO') return false
  return null
}

function parseScore(value: string | undefined): number | null {
  if (value === undefined || value === null || value === '' || value === 'N/A') {
    return null
  }
  const num = Number(value)
  return Number.isNaN(num) ? null : num
}

/**
 * Maps handover criminogenic needs data to internal format (scores and linked indicators).
 */
export function mapHandoverToCriminogenicNeeds(
  handoverData: HandoverCriminogenicNeedsData | undefined,
): InternalCriminogenicNeedsData | null {
  if (!handoverData) {
    return null
  }

  const result = {} as InternalCriminogenicNeedsData

  for (const mapping of areaMappings) {
    const areaData = handoverData[mapping.handoverKey] as Record<string, YesNoNullOrNA | string | undefined>

    const needArea: CriminogenicNeedArea = {
      linkedToHarm: areaData ? yesNoToBoolean(areaData[mapping.harmKey] as YesNoNullOrNA | undefined) : null,
      linkedToReoffending: areaData
        ? yesNoToBoolean(areaData[mapping.reoffendingKey] as YesNoNullOrNA | undefined)
        : null,
      linkedToStrengthsOrProtectiveFactors: areaData
        ? yesNoToBoolean(areaData[mapping.strengthsKey] as YesNoNullOrNA | undefined)
        : null,
      score: areaData ? parseScore(areaData[mapping.scoreKey] as string | undefined) : null,
    }

    result[mapping.internalKey] = needArea
  }

  return result
}
