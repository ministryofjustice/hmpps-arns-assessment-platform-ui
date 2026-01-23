import { escapeHtmlEntities, sanitizeValue } from './sanitize'

describe('sanitize', () => {
  describe('escapeHtmlEntities()', () => {
    it('should NOT escape less-than character (handled by template auto-escaping)', () => {
      // Arrange
      const input = '<script>'

      // Act
      const result = escapeHtmlEntities(input)

      // Assert - no encoding, template engine handles XSS at render time
      expect(result).toBe('<script>')
    })

    it('should NOT escape greater-than character (handled by template auto-escaping)', () => {
      // Arrange
      const input = 'Complete > 80% of sessions'

      // Act
      const result = escapeHtmlEntities(input)

      // Assert
      expect(result).toBe('Complete > 80% of sessions')
    })

    it('should NOT escape ampersand (handled by template auto-escaping)', () => {
      // Arrange
      const input = 'Drugs & alcohol support'

      // Act
      const result = escapeHtmlEntities(input)

      // Assert
      expect(result).toBe('Drugs & alcohol support')
    })

    it('should NOT escape double quotes (handled by template auto-escaping)', () => {
      // Arrange
      const input = 'Complete "thinking skills" programme'

      // Act
      const result = escapeHtmlEntities(input)

      // Assert
      expect(result).toBe('Complete "thinking skills" programme')
    })

    it('should NOT escape single quotes (handled by template auto-escaping)', () => {
      // Arrange
      const input = "John's first goal"

      // Act
      const result = escapeHtmlEntities(input)

      // Assert
      expect(result).toBe("John's first goal")
    })

    it('should pass through XSS payloads unchanged (template handles at render time)', () => {
      // Arrange
      const input = '<script>alert("XSS & \'attack\'")</script>'

      // Act
      const result = escapeHtmlEntities(input)

      // Assert - no encoding, Nunjucks auto-escape will handle this at render
      expect(result).toBe('<script>alert("XSS & \'attack\'")</script>')
    })

    it('should return unchanged string with no special characters', () => {
      // Arrange
      const input = 'Find stable accommodation'

      // Act
      const result = escapeHtmlEntities(input)

      // Assert
      expect(result).toBe('Find stable accommodation')
    })

    it('should handle empty string', () => {
      // Arrange
      const input = ''

      // Act
      const result = escapeHtmlEntities(input)

      // Assert
      expect(result).toBe('')
    })

    it('should pass through img tag XSS payload unchanged', () => {
      // Arrange
      const input = '<img src=x onerror="alert(\'XSS\')">'

      // Act
      const result = escapeHtmlEntities(input)

      // Assert - no encoding, template engine handles XSS at render time
      expect(result).toBe('<img src=x onerror="alert(\'XSS\')">')
    })

    it('should preserve HTML entities typed by user', () => {
      // Arrange - user intentionally types "&amp;"
      const input = 'Learn about R&amp;D processes'

      // Act
      const result = escapeHtmlEntities(input)

      // Assert - preserved as-is, template will encode & to &amp;
      // resulting in "&amp;amp;" which displays as "&amp;" (user's intent)
      expect(result).toBe('Learn about R&amp;D processes')
    })

    it('should preserve all special characters for complex input', () => {
      // Arrange
      const input = "Complete life skills ('basic') - cooking & cleaning > 80% &amp; participation"

      // Act
      const result = escapeHtmlEntities(input)

      // Assert - all characters preserved, template handles encoding at render
      expect(result).toBe("Complete life skills ('basic') - cooking & cleaning > 80% &amp; participation")
    })
  })

  describe('sanitizeValue()', () => {
    it('should pass through string values unchanged', () => {
      // Arrange
      const input = '<b>Important goal</b>'

      // Act
      const result = sanitizeValue(input)

      // Assert - no encoding, template handles XSS at render time
      expect(result).toBe('<b>Important goal</b>')
    })

    it('should return numbers unchanged', () => {
      // Arrange
      const input = 42

      // Act
      const result = sanitizeValue(input)

      // Assert
      expect(result).toBe(42)
    })

    it('should return booleans unchanged', () => {
      // Arrange
      const input = true

      // Act
      const result = sanitizeValue(input)

      // Assert
      expect(result).toBe(true)
    })

    it('should return null unchanged', () => {
      // Arrange
      const input: unknown = null

      // Act
      const result = sanitizeValue(input)

      // Assert
      expect(result).toBeNull()
    })

    it('should return undefined unchanged', () => {
      // Arrange
      const input: unknown = undefined

      // Act
      const result = sanitizeValue(input)

      // Assert
      expect(result).toBeUndefined()
    })

    it('should return arrays unchanged', () => {
      // Arrange
      const input = ['Accommodation', 'Employment']

      // Act
      const result = sanitizeValue(input)

      // Assert
      expect(result).toEqual(['Accommodation', 'Employment'])
    })

    it('should return objects unchanged', () => {
      // Arrange
      const input = { title: 'Health & wellbeing goal' }

      // Act
      const result = sanitizeValue(input)

      // Assert
      expect(result).toEqual({ title: 'Health & wellbeing goal' })
    })
  })
})
