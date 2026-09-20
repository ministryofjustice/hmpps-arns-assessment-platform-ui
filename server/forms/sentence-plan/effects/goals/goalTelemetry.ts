import crypto from 'crypto'

export type MatchRating = 'exact' | 'high' | 'partial' | 'low'

export interface GoalMatchResult {
  suggestedGoalTitle: string | null
  matchRating: MatchRating | null
  matchPercentage: number
}

export function hashGoalText(text: string): string {
  const normalised = normalise(text)
  return crypto.createHash('sha256').update(normalised).digest('hex')
}

/**
 * Compares a submitted goal title against the list of suggested goal templates.
 * Returns the best match with a confidence rating and percentage.
 *
 * Matching is template-aware: bracketed placeholders (e.g. [number of days]) are stripped
 * from the template before comparison, so user-filled content doesn't penalise the score.
 */
export function matchSuggestedGoal(submittedTitle: string, suggestedGoals: string[]): GoalMatchResult {
  if (!submittedTitle || suggestedGoals.length === 0) {
    return { suggestedGoalTitle: null, matchRating: null, matchPercentage: 0 }
  }

  let bestMatch: GoalMatchResult = { suggestedGoalTitle: null, matchRating: null, matchPercentage: 0 }

  for (const template of suggestedGoals) {
    const percentage = calculateMatchPercentage(submittedTitle, template)

    if (percentage > bestMatch.matchPercentage) {
      bestMatch = {
        suggestedGoalTitle: template,
        matchRating: percentageToRating(percentage),
        matchPercentage: percentage,
      }
    }
  }

  if (!bestMatch.matchRating) {
    return { suggestedGoalTitle: null, matchRating: null, matchPercentage: bestMatch.matchPercentage }
  }

  return bestMatch
}

/**
 * Calculates how closely a submitted title matches a suggested goal template.
 * Strips bracketed placeholders from the template to get the "skeleton",
 * then measures what proportion of skeleton words appear in the submitted text.
 *
 * Only a literal match (text unchanged) scores 100% ("exact").
 * Full skeleton overlap with any modification caps at 99% ("high").
 */
function calculateMatchPercentage(submitted: string, template: string): number {
  const normalisedSubmitted = normalise(submitted)
  const normalisedTemplate = normalise(template)

  // True exact match — template text is completely unchanged
  if (normalisedSubmitted === normalisedTemplate) {
    return 100
  }

  // Strip bracketed placeholders to get skeleton
  const skeleton = normalisedTemplate.replace(/\[.*?\]/g, ' ')
  const skeletonWords = tokenise(skeleton)

  if (skeletonWords.length === 0) {
    return 0
  }

  const submittedWords = new Set(tokenise(normalisedSubmitted))
  const matchingWords = skeletonWords.filter(word => submittedWords.has(word))
  const rawPercentage = Math.round((matchingWords.length / skeletonWords.length) * 100)

  // Cap at 99 — only a literal match gets 100 ("exact")
  return Math.min(rawPercentage, 99)
}

function percentageToRating(percentage: number): MatchRating | null {
  if (percentage >= 100) return 'exact'
  if (percentage >= 85) return 'high'
  if (percentage >= 60) return 'partial'
  if (percentage >= 40) return 'low'
  return null
}

function normalise(text: string): string {
  return text.toLowerCase().replace(/['']/g, "'").replace(/\s+/g, ' ').trim()
}

function tokenise(text: string): string[] {
  return text
    .replace(/[^a-z0-9' -]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length >= 1)
}
