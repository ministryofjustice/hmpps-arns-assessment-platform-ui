import { GoalAnswers, GoalProperties, GoalStatus } from '../types'

export const MONTHS_BY_OPTION: Record<string, number> = {
  date_in_3_months: 3,
  date_in_6_months: 6,
  date_in_12_months: 12,
}

// Determine which target date option matches a given target date (if any):
export const getMatchingTargetDateOption = (targetDate: string): string | null => {
  const targetDateStr = targetDate.substring(0, 10)

  for (const [option, months] of Object.entries(MONTHS_BY_OPTION)) {
    const date = new Date()
    date.setMonth(date.getMonth() + months)
    if (date.toISOString().substring(0, 10) === targetDateStr) {
      return option
    }
  }

  return null
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
