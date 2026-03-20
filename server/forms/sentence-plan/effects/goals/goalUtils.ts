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
 * Validated base context for effects.
 */
export interface EffectContext {
  user: User
  assessmentUuid: string
}

/**
 * Assert and extract base context (user and assessmentUuid).
 *
 * @throws InternalServerError if user or assessmentUuid is missing
 */
export const getRequiredEffectContext = (context: SentencePlanContext, effectName: string): EffectContext => {
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

/**
 * Get practitioner display name from session, falling back to user.name.
 */
export const getPractitionerName = (context: SentencePlanContext, user: User): string => {
  const session = context.getSession()
  return session.practitionerDetails?.displayName || user.name
}

// ============================================================================
// Active Goal Helpers
// ============================================================================

/**
 * Active goal lookup result from request params + derived goals.
 */
export interface ActiveGoalResolution {
  goalUuid: string
  activeGoal: DerivedGoal
}

/**
 * Resolve the active goal from route param `:uuid`.
 *
 * Returns null when:
 * - route has no UUID
 * - UUID is the literal ':uuid' placeholder
 * - no matching goal exists in Data('goals')
 */
export const resolveActiveGoalFromRequest = (context: SentencePlanContext): ActiveGoalResolution | null => {
  const goalUuid = context.getRequestParam('uuid')

  if (!goalUuid || goalUuid === ':uuid') {
    return null
  }

  const goals = context.getData('goals') as DerivedGoal[] | undefined
  const activeGoal = goals?.find(goal => goal.uuid === goalUuid)

  if (!activeGoal) {
    return null
  }

  return { goalUuid, activeGoal }
}

/**
 * Store active goal identifiers in context for downstream effects and step logic.
 */
export const setActiveGoalData = (
  context: SentencePlanContext,
  { goalUuid, activeGoal }: ActiveGoalResolution,
): void => {
  context.setData('activeGoal', activeGoal)
  context.setData('activeGoalUuid', goalUuid)
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
