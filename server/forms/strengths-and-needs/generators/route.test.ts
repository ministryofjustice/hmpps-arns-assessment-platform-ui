import { createRoute } from './route'

describe('createRoute', () => {
  let generator: ReturnType<typeof createRoute>

  beforeEach(() => {
    generator = createRoute()
  })

  describe('basic path construction', () => {
    it('should create a simple path from segments', () => {
      const result = generator(['strengths-and-needs', 'v1.0', 'accommodation'], [])
      expect(result).toBe('/strengths-and-needs/v1.0/accommodation')
    })

    it('should handle a single segment', () => {
      const result = generator(['accommodation'], [])
      expect(result).toBe('/accommodation')
    })

    it('should handle an empty array', () => {
      const result = generator([], [])
      expect(result).toBe('/')
    })
  })

  describe('nested slashes in segments', () => {
    it('should flatten nested slashes in segments', () => {
      const result = generator(['strengths-and-needs/v1.0', 'accommodation'], [])
      expect(result).toBe('/strengths-and-needs/v1.0/accommodation')
    })

    it('should flatten multiple nested slashes', () => {
      const result = generator(['strengths-and-needs/v1.0/edit', 'accommodation/details'], [])
      expect(result).toBe('/strengths-and-needs/v1.0/edit/accommodation/details')
    })

    it('should handle segments with leading slashes', () => {
      const result = generator(['/strengths-and-needs', '/v1.0', 'accommodation'], [])
      expect(result).toBe('/strengths-and-needs/v1.0/accommodation')
    })

    it('should handle segments with trailing slashes', () => {
      const result = generator(['strengths-and-needs/', 'v1.0/', 'accommodation'], [])
      expect(result).toBe('/strengths-and-needs/v1.0/accommodation')
    })

    it('should handle segments with both leading and trailing slashes', () => {
      const result = generator(['/strengths-and-needs/', '/v1.0/', 'accommodation'], [])
      expect(result).toBe('/strengths-and-needs/v1.0/accommodation')
    })
  })

  describe('URI encoding', () => {
    it('should URI-encode path segments with special characters', () => {
      const result = generator(['path', 'with spaces', 'section'], [])
      expect(result).toBe('/path/with%20spaces/section')
    })

    it('should URI-encode ampersands and other reserved characters', () => {
      const result = generator(['path', 'with&ampersand'], [])
      expect(result).toBe('/path/with%26ampersand')
    })

    it('should URI-encode question marks', () => {
      const result = generator(['path', 'question?mark'], [])
      expect(result).toBe('/path/question%3Fmark')
    })

    it('should not double-encode already encoded segments', () => {
      // Note: segments come pre-resolved from the framework, so they won't be pre-encoded
      const result = generator(['path', 'normal-segment'], [])
      expect(result).toBe('/path/normal-segment')
    })
  })

  describe('query parameters', () => {
    it('should append a single query parameter', () => {
      const result = generator(['accommodation'], [{ name: 'resume', value: 'true' }])
      expect(result).toBe('/accommodation?resume=true')
    })

    it('should append multiple query parameters', () => {
      const result = generator(
        ['accommodation'],
        [
          { name: 'resume', value: 'true' },
          { name: 'section', value: 'edit' },
        ],
      )
      expect(result).toMatch(/\/accommodation\?/)
      expect(result).toContain('resume=true')
      expect(result).toContain('section=edit')
      expect(result).toContain('&')
    })

    it('should URI-encode query parameter values', () => {
      const result = generator(['accommodation'], [{ name: 'filter', value: 'value with spaces' }])
      expect(result).toBe('/accommodation?filter=value+with+spaces')
    })

    it('should handle empty query parameters array', () => {
      const result = generator(['accommodation'], [])
      expect(result).toBe('/accommodation')
    })
  })

  describe('complex scenarios', () => {
    it('should build a complete path with mode and uuid parameters', () => {
      const result = generator(
        ['strengths-and-needs/v1.0', 'edit', '8e7073a6-7a64-4ce6-a34a-d54568db4714', 'accommodation'],
        [],
      )
      expect(result).toBe('/strengths-and-needs/v1.0/edit/8e7073a6-7a64-4ce6-a34a-d54568db4714/accommodation')
    })

    it('should build a path with nested slashes and query parameters', () => {
      const result = generator(
        ['strengths-and-needs/v1.0', 'view', 'uuid-123', 'section'],
        [{ name: 'resume', value: 'true' }],
      )
      expect(result).toBe('/strengths-and-needs/v1.0/view/uuid-123/section?resume=true')
    })

    it('should handle previous-versions path', () => {
      const result = generator(['strengths-and-needs/v1.0', 'edit', 'abc-123', 'previous-versions'], [])
      expect(result).toBe('/strengths-and-needs/v1.0/edit/abc-123/previous-versions')
    })

    it('should handle view-all-answers path', () => {
      const result = generator(['strengths-and-needs/v1.0', 'view', 'def-456', 'view-all-answers'], [])
      expect(result).toBe('/strengths-and-needs/v1.0/view/def-456/view-all-answers')
    })

    it('should handle nested section paths', () => {
      const result = generator(['strengths-and-needs/v1.0', 'edit', 'uuid', 'drug-use/drug-details'], [])
      expect(result).toBe('/strengths-and-needs/v1.0/edit/uuid/drug-use/drug-details')
    })
  })

  describe('edge cases', () => {
    it('should filter out empty string segments', () => {
      const result = generator(['path', '', 'section'], [])
      expect(result).toBe('/path/section')
    })

    it('should filter out null and undefined segments', () => {
      const result = generator(['path', null as any, undefined as any, 'section'], [])
      expect(result).toBe('/path/section')
    })

    it('should handle segments that are only slashes', () => {
      const result = generator(['path', '/', '///', 'section'], [])
      expect(result).toBe('/path/section')
    })

    it('should preserve hyphenated and underscored names', () => {
      const result = generator(['strengths-and-needs', 'personal-relationships_v2'], [])
      expect(result).toBe('/strengths-and-needs/personal-relationships_v2')
    })

    it('should handle UUID segments correctly', () => {
      const result = generator(['section', '8e7073a6-7a64-4ce6-a34a-d54568db4714'], [])
      expect(result).toBe('/section/8e7073a6-7a64-4ce6-a34a-d54568db4714')
    })
  })
})
