/** Port of oasys/datamapping/MappingProviderTest.kt. */

import { MappingProvider } from '../mappingProvider'
import { MappingNotFoundException } from '../exceptions'

describe('MappingProvider', () => {
  const sut = new MappingProvider()

  describe('get', () => {
    it.each(['X.Y', ''])('throws exception when version not found: `%s`', version => {
      expect(() => sut.get(version)).toThrow(new MappingNotFoundException(version))
    })

    it('returns section mappings for existing form version', () => {
      const result = sut.get('1.0')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })
  })
})
