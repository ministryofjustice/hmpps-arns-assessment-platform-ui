import { hashGoalText, matchSuggestedGoal } from './goalTelemetry'

describe('goalTelemetry', () => {
  describe('hashGoalText', () => {
    it('produces a consistent SHA-256 hash', () => {
      const hash1 = hashGoalText('I will find a job')
      const hash2 = hashGoalText('I will find a job')
      expect(hash1).toBe(hash2)
      expect(hash1).toHaveLength(64) // SHA-256 hex
    })

    it('normalises before hashing (case, whitespace)', () => {
      const hash1 = hashGoalText('I Will Find A Job')
      const hash2 = hashGoalText('i will find a job')
      expect(hash1).toBe(hash2)
    })

    it('normalises extra whitespace', () => {
      const hash1 = hashGoalText('I will  find   a job')
      const hash2 = hashGoalText('I will find a job')
      expect(hash1).toBe(hash2)
    })

    it('produces different hashes for different text', () => {
      const hash1 = hashGoalText('I will find a job')
      const hash2 = hashGoalText('I will find accommodation')
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('matchSuggestedGoal', () => {
    const suggestedGoals = [
      'I will increase the number of days I am drug-free each week from [number of days] to [number of days]',
      'I will improve my understanding of why I use drugs when [add reasons for drug use]',
      'I will find a job, so that [add why]',
    ]

    it('returns exact when text is completely unchanged (including brackets)', () => {
      const result = matchSuggestedGoal(
        'I will increase the number of days I am drug-free each week from [number of days] to [number of days]',
        suggestedGoals,
      )
      expect(result.matchRating).toBe('exact')
      expect(result.matchPercentage).toBe(100)
      expect(result.suggestedGoalTitle).not.toBeNull()
    })

    it('returns high when only placeholders are filled', () => {
      const result = matchSuggestedGoal(
        'I will increase the number of days I am drug-free each week from 1 to 7',
        suggestedGoals,
      )
      expect(result.matchRating).toBe('high')
      expect(result.matchPercentage).toBe(99)
    })

    it('returns high when one word is changed', () => {
      const result = matchSuggestedGoal(
        'I will increase the number of days I am drug-free each month from 1 to 7',
        suggestedGoals,
      )
      expect(result.matchRating).toBe('high')
      expect(result.matchPercentage).toBeGreaterThanOrEqual(85)
    })

    it('returns high when placeholder text is replaced with user content', () => {
      const result = matchSuggestedGoal(
        'I will improve my understanding of why I use drugs when I do something and maybe something else',
        suggestedGoals,
      )
      expect(result.matchRating).toBe('high')
      expect(result.matchPercentage).toBe(99)
    })

    it('returns partial for a shortened but recognisable version', () => {
      const result = matchSuggestedGoal('I will increase the number of days I am drug-free', suggestedGoals)
      expect(result.matchRating).toBe('partial')
      expect(result.matchPercentage).toBeGreaterThanOrEqual(60)
      expect(result.matchPercentage).toBeLessThan(85)
    })

    it('returns low for loosely related text', () => {
      const result = matchSuggestedGoal('I will increase my drug-free days', suggestedGoals)
      expect(result.matchRating).toBe('low')
      expect(result.matchPercentage).toBeGreaterThanOrEqual(40)
      expect(result.matchPercentage).toBeLessThan(60)
    })

    it('returns null rating for unrelated text', () => {
      const result = matchSuggestedGoal('I enjoy painting landscapes on weekends', suggestedGoals)
      expect(result.matchRating).toBeNull()
      expect(result.matchPercentage).toBeLessThan(40)
    })

    it('reports correct percentage for short common text', () => {
      const goals = ['I will complete [add course or qualification]']
      const result = matchSuggestedGoal('I will', goals)
      // "I will" matches 2 of 3 skeleton words ["i", "will", "complete"] = 67%
      expect(result.matchPercentage).toBe(67)
      expect(result.matchRating).toBe('partial')
    })

    it('matches the best suggested goal when multiple are provided', () => {
      const result = matchSuggestedGoal('I will find a job, so that I can support my family', suggestedGoals)
      expect(result.matchRating).toBe('high')
      expect(result.suggestedGoalTitle).toBe('I will find a job, so that [add why]')
    })

    it('returns null for empty input', () => {
      const result = matchSuggestedGoal('', suggestedGoals)
      expect(result.matchRating).toBeNull()
      expect(result.suggestedGoalTitle).toBeNull()
    })

    it('returns high not exact when placeholder is filled with content', () => {
      const accommodationGoals = ['I will maintain my current accommodation so that [add why]']
      const result = matchSuggestedGoal(
        'I will maintain my current accommodation so that so I can eat cheese',
        accommodationGoals,
      )
      expect(result.matchRating).toBe('high')
      expect(result.matchPercentage).toBeLessThan(100)
    })

    it('returns null for empty suggested goals list', () => {
      const result = matchSuggestedGoal('I will find a job', [])
      expect(result.matchRating).toBeNull()
      expect(result.suggestedGoalTitle).toBeNull()
    })

    it('returns the same suggested goal title for different submissions matching the same template', () => {
      const result1 = matchSuggestedGoal(
        'I will increase the number of days I am drug-free each week from 1 to 7',
        suggestedGoals,
      )
      const result2 = matchSuggestedGoal(
        'I will increase the number of days I am drug-free each month from 2 to 5',
        suggestedGoals,
      )
      expect(result1.suggestedGoalTitle).toBe(result2.suggestedGoalTitle)
    })
  })
})
