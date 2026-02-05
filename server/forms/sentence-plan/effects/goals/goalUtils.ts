import { InternalServerError } from 'http-errors'
import { User } from '../../../../interfaces/user'
import { AreaOfNeed, DerivedGoal, GoalAnswers, GoalProperties, GoalStatus, SentencePlanContext } from '../types'

export const MONTHS_BY_OPTION: Record<string, number> = {
  date_in_3_months: 3,
  date_in_6_months: 6,
  date_in_12_months: 12,
}

const isSameDay = (a: Date, b: Date): boolean => {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

// Determine which target date option matches a given target date (if any):
export const getMatchingTargetDateOption = (targetDate: Date): string | null => {
  const match = Object.entries(MONTHS_BY_OPTION).find(([, months]) => {
    const optionDate = new Date()
    optionDate.setMonth(optionDate.getMonth() + months)
    return isSameDay(targetDate, optionDate)
  })

  return match ? match[0] : null
}

// Calculate the target date based on form selections:
export const calculateTargetDate = (canStartNow = '', targetDateOption = '', customDate = ''): string | null => {
  if (canStartNow !== 'yes') {
    return null
  }

  const monthsToAdd = MONTHS_BY_OPTION[targetDateOption]

  if (monthsToAdd) {
    const date = new Date()
    date.setMonth(date.getMonth() + monthsToAdd)
    return date.toISOString()
  }

  if (targetDateOption === 'set_another_date' && customDate) {
    return new Date(customDate).toISOString()
  }

  return null
}

// Determine goal status based on whether they can start now:
export const determineGoalStatus = (canStartNow = ''): GoalStatus => {
  return canStartNow === 'yes' ? 'ACTIVE' : 'FUTURE'
}

// Build goal properties object:
export const buildGoalProperties = (status: GoalStatus): GoalProperties => {
  return {
    status,
    status_date: new Date().toISOString(),
  }
}

// Build goal answers object:
export const buildGoalAnswers = (
  title: string,
  areaOfNeed: string,
  relatedAreasOfNeed: string[],
  targetDate: string | null,
): GoalAnswers => {
  return {
    title,
    area_of_need: areaOfNeed,
    related_areas_of_need: relatedAreasOfNeed,
    ...(targetDate && { target_date: targetDate }),
  }
}

// ============================================================================
// Context Assertion Helpers
// ============================================================================

/**
 * Context for effects that operate on an active goal.
 * Provides validated user, assessment, goal, and practitioner name.
 */
export interface GoalEffectContext {
  user: User
  assessmentUuid: string
  activeGoal: DerivedGoal
  practitionerName: string
}

/**
 * Assert and extract context required for goal-related effects.
 *
 * Validates that user, assessmentUuid, and activeGoal are present,
 * and extracts the practitioner name from session (falling back to user.name).
 *
 * @throws InternalServerError if any required field is missing
 */
export const assertGoalEffectContext = (context: SentencePlanContext, effectName: string): GoalEffectContext => {
  const user = context.getState('user')
  const session = context.getSession()
  const assessmentUuid = context.getData('assessmentUuid')
  const activeGoal = context.getData('activeGoal')

  if (!user) {
    throw new InternalServerError(`User is required for ${effectName}`)
  }

  if (!assessmentUuid) {
    throw new InternalServerError(`Assessment UUID is required for ${effectName}`)
  }

  if (!activeGoal?.uuid) {
    throw new InternalServerError(`Active goal is required for ${effectName}`)
  }

  const practitionerName = session.practitionerDetails?.displayName || user.name

  return { user, assessmentUuid, activeGoal, practitionerName }
}

/**
 * Context for effects that don't require an active goal.
 */
export interface BaseEffectContext {
  user: User
  assessmentUuid: string
}

/**
 * Assert and extract base context (user and assessmentUuid only).
 *
 * Use this for effects that don't operate on a specific goal.
 *
 * @throws InternalServerError if user or assessmentUuid is missing
 */
export const assertBaseEffectContext = (context: SentencePlanContext, effectName: string): BaseEffectContext => {
  const user = context.getState('user')
  const assessmentUuid = context.getData('assessmentUuid')

  if (!user) {
    throw new InternalServerError(`User is required for ${effectName}`)
  }

  if (!assessmentUuid) {
    throw new InternalServerError(`Assessment UUID is required for ${effectName}`)
  }

  return { user, assessmentUuid }
}

// ============================================================================
// Area of Need Helpers
// ============================================================================

/**
 * Derive area of need data from a list of areas and a current area slug.
 *
 * Returns the current area, other areas (sorted alphabetically), and all slugs.
 * This is a pure function that can be used by multiple effects.
 */
export const deriveAreasOfNeedData = (
  areasOfNeed: AreaOfNeed[],
  currentAreaSlug: string,
): {
  currentAreaOfNeed: AreaOfNeed | undefined
  otherAreasOfNeed: AreaOfNeed[]
  areaOfNeedSlugs: string[]
} => {
  return {
    currentAreaOfNeed: areasOfNeed.find(a => a.slug === currentAreaSlug),
    otherAreasOfNeed: areasOfNeed
      .filter(a => a.slug !== currentAreaSlug)
      .sort((a, b) => a.text.localeCompare(b.text)),
    areaOfNeedSlugs: areasOfNeed.map(a => a.slug),
  }
}
