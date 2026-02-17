import type nunjucks from 'nunjucks'
import { buildNunjucksComponent } from '@form-engine-express-nunjucks/utils/buildNunjucksComponent'
import {
  BasicBlockProps,
  BlockDefinition,
  ConditionalString,
  EvaluatedBlock,
} from '@form-engine/form/types/structures.type'
import { ChainableRef, ChainableScopedRef } from '@form-engine/form/builders/types'
import { block as blockBuilder } from '@form-engine/form/builders'
import {
  AssessmentArea,
  LinkedIndicator,
  MotivationLevel,
} from '../../../../interfaces/coordinator-api/entityAssessment'

export interface AssessmentInfoDetailsProps extends BasicBlockProps {
  personName: ConditionalString
  areaName: ConditionalString
  // assessment data: can be static, a Data() reference, or an Item() scoped reference
  assessmentData: AssessmentArea | null | ChainableRef | ChainableScopedRef
  status: ConditionalString
  fullWidth?: boolean
  // when true (default), wraps content in a govuk details component.
  // - can be set to false so that content rendered directly without the collapsible wrapper
  // (useful when embedding inside other expandable containers like accordions)
  showAsDetails?: boolean
}

export interface AssessmentInfoDetailsBlock extends BlockDefinition, AssessmentInfoDetailsProps {
  variant: 'assessmentInfoDetails'
}

/**
 * Converts LinkedIndicator to display text.
 */
export function getLinkedText(indicator: LinkedIndicator, yesText: string, noText: string): string | null {
  if (indicator === 'YES') return yesText
  if (indicator === 'NO') return noText
  return null
}

/**
 * Converts MotivationLevel to human-readable text with person's name.
 */
export function getMotivationText(motivation: MotivationLevel, personName: string): string | null {
  switch (motivation) {
    case 'MADE_CHANGES':
      return `${personName} has already made positive changes and wants to maintain them.`
    case 'MAKING_CHANGES':
      return `${personName} is actively making changes.`
    case 'WANT_TO_MAKE_CHANGES':
      return `${personName} wants to make changes and knows how to.`
    case 'NEEDS_HELP_TO_MAKE_CHANGES':
      return `${personName} wants to make changes but needs help.`
    case 'THINKING_ABOUT_MAKING_CHANGES':
      return `${personName} is thinking about making changes.`
    case 'DOES_NOT_WANT_TO_MAKE_CHANGES':
      return `${personName} does not want to make changes.`
    case 'DOES_NOT_WANT_TO_ANSWER':
      return `${personName} does not want to answer.`
    case 'NOT_PRESENT':
      return `${personName} was not present to answer this question.`
    case 'NOT_APPLICABLE':
      return 'This question was not applicable.'
    default:
      return null
  }
}

/**
 * Checks if any assessment data is available.
 */
export function hasAnyData(data: AssessmentArea | null): boolean {
  if (!data) return false
  return data.isAssessmentSectionComplete ||
    data.linkedToHarm != null ||
    data.linkedToReoffending != null ||
    data.linkedToStrengthsOrProtectiveFactors != null ||
    data.motivationToMakeChanges != null ||
    data.score != null
}

/**
 * Builds the template parameters for rendering.
 */
export function buildParams(block: EvaluatedBlock<AssessmentInfoDetailsBlock>) {
  const { personName, areaName, assessmentData, status, fullWidth, showAsDetails = true } = block
  const data = assessmentData as AssessmentArea | null

  const isError = status === 'error'
  const hasData = hasAnyData(data)
  const isComplete = data?.isAssessmentSectionComplete === true

  const roshLinked = data?.linkedToHarm
  const roshText = getLinkedText(roshLinked, 'is', 'is not')
  const roshDetails = roshLinked ? data?.riskOfSeriousHarmDetails : null

  const reoffendingLinked = data?.linkedToReoffending
  const reoffendingText = getLinkedText(reoffendingLinked, 'is', 'is not')
  const reoffendingDetails = reoffendingLinked ? data?.riskOfReoffendingDetails : null

  const motivationText = getMotivationText(data?.motivationToMakeChanges ?? null, personName as string)
  const motivationBypassed = data != null && data.motivationToMakeChanges == null && data.isAssessmentSectionComplete

  const strengthsLinked = data?.linkedToStrengthsOrProtectiveFactors
  const strengthsText = getLinkedText(strengthsLinked, 'are', 'are no')
  const strengthsDetails = strengthsLinked ? data?.strengthsOrProtectiveFactorsDetails : null

  const missingItems: string[] = []

  // NOTE: removed '&& !isComplete': this is to account for edge cases where SAN returns assessment data with section complete
  // but area didn't receive score from OASYS for some reason yet (even though threshold is present)
  if (data) {
    if (data.linkedToHarm == null) {
      missingItems.push('whether this area is linked to RoSH (risk of serious harm)')
    }
    if (data.linkedToReoffending == null) {
      missingItems.push('whether this area is linked to risk of reoffending')
    }
    if (data.motivationToMakeChanges == null && !motivationBypassed) {
      missingItems.push('motivation to make changes')
    }
    if (data.linkedToStrengthsOrProtectiveFactors == null) {
      missingItems.push('strengths and protective factors')
    }
    if (data.score == null && data.upperBound != null) {
      missingItems.push('the need score')
    }
  }

  // score section data (only shown when not showAsDetails (for use on About page))
  const score = data?.score ?? null
  const upperBound = data?.upperBound ?? null
  const threshold = data?.threshold ?? null
  const hasScore = score !== null && upperBound !== null && threshold !== null

  // sub-area data (for example, Lifestyle and associates within Thinking, behaviours and attitudes)
  const subArea = data?.subArea ?? null
  const hasSubArea = subArea !== null && subArea.score !== null

  return {
    personName,
    areaName,
    isError,
    hasData,
    isComplete,
    roshLinked,
    roshText,
    roshDetails,
    reoffendingLinked,
    reoffendingText,
    reoffendingDetails,
    motivationText,
    motivationBypassed,
    strengthsLinked,
    strengthsText,
    strengthsDetails,
    score,
    upperBound,
    threshold,
    hasScore,
    subArea,
    hasSubArea,
    missingItems,
    hasMissingItems: missingItems.length > 0,
    fullWidth,
    showAsDetails,
  }
}

async function renderAssessmentInfoDetails(
  block: EvaluatedBlock<AssessmentInfoDetailsBlock>,
  nunjucksEnv: nunjucks.Environment,
): Promise<string> {
  const params = buildParams(block)
  return nunjucksEnv.render('sentence-plan/components/assessment-info-details/assessmentInfoDetails.njk', { params })
}

export const assessmentInfoDetails = buildNunjucksComponent<AssessmentInfoDetailsBlock>(
  'assessmentInfoDetails',
  renderAssessmentInfoDetails,
)

export function AssessmentInfoDetails(props: AssessmentInfoDetailsProps): AssessmentInfoDetailsBlock {
  return blockBuilder<AssessmentInfoDetailsBlock>({ ...props, variant: 'assessmentInfoDetails' })
}
