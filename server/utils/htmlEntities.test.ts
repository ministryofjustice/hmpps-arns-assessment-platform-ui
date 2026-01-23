import { decodeHtmlEntities, escapeHtml } from './htmlEntities'

describe('decodeHtmlEntities', () => {
  it('returns empty string for undefined', () => {
    expect(decodeHtmlEntities(undefined)).toBe('')
  })

  it('returns empty string for empty string', () => {
    expect(decodeHtmlEntities('')).toBe('')
  })

  it('returns text unchanged when no entities present', () => {
    expect(decodeHtmlEntities('Hello world')).toBe('Hello world')
  })

  it('decodes single quotes', () => {
    expect(decodeHtmlEntities('It&#39;s working')).toBe("It's working")
    expect(decodeHtmlEntities('It&apos;s working')).toBe("It's working")
  })

  it('decodes double quotes', () => {
    expect(decodeHtmlEntities('Say &quot;hello&quot;')).toBe('Say "hello"')
  })

  it('decodes less than and greater than', () => {
    expect(decodeHtmlEntities('a &lt; b &gt; c')).toBe('a < b > c')
  })

  it('decodes ampersand', () => {
    expect(decodeHtmlEntities('Fish &amp; Chips')).toBe('Fish & Chips')
  })

  it('decodes multiple entities', () => {
    expect(decodeHtmlEntities('&lt;div class=&quot;test&quot;&gt;Fish &amp; Chips&#39;s&lt;/div&gt;')).toBe(
      '<div class="test">Fish & Chips\'s</div>',
    )
  })

  it('preserves literal entity text when user typed it (ampersand decoded last)', () => {
    // User typed "&lt;" literally - stored as "&amp;lt;" after form encoding+decode
    // When we decode, &amp; becomes &, leaving "&lt;" intact
    expect(decodeHtmlEntities('&amp;lt;')).toBe('&lt;')
    expect(decodeHtmlEntities('&amp;gt;')).toBe('&gt;')
    expect(decodeHtmlEntities('&amp;amp;')).toBe('&amp;')
  })
})

describe('escapeHtml', () => {
  it('returns empty string for undefined', () => {
    expect(escapeHtml(undefined)).toBe('')
  })

  it('returns empty string for empty string', () => {
    expect(escapeHtml('')).toBe('')
  })

  it('returns text unchanged when no special characters', () => {
    expect(escapeHtml('Hello world')).toBe('Hello world')
  })

  it('escapes ampersand', () => {
    expect(escapeHtml('Fish & Chips')).toBe('Fish &amp; Chips')
  })

  it('escapes less than and greater than', () => {
    expect(escapeHtml('a < b > c')).toBe('a &lt; b &gt; c')
  })

  it('escapes quotes', () => {
    expect(escapeHtml('Say "hello"')).toBe('Say &quot;hello&quot;')
    expect(escapeHtml("It's working")).toBe('It&#39;s working')
  })

  it('escapes multiple special characters', () => {
    expect(escapeHtml('<div class="test">Fish & Chips\'s</div>')).toBe(
      '&lt;div class=&quot;test&quot;&gt;Fish &amp; Chips&#39;s&lt;/div&gt;',
    )
  })

  it('escapes ampersand first to prevent double-escaping', () => {
    // If user typed "&lt;" literally, it should become "&amp;lt;" not "&amp;amp;lt;"
    expect(escapeHtml('&lt;')).toBe('&amp;lt;')
    expect(escapeHtml('&amp;')).toBe('&amp;amp;')
  })
})

describe('decode and escape are inverses', () => {
  it('escaping then decoding returns original for plain text', () => {
    const original = "Fish & Chips's <test>"
    expect(decodeHtmlEntities(escapeHtml(original))).toBe(original)
  })

  it('decoding then escaping returns original for encoded text', () => {
    const encoded = 'Fish &amp; Chips&#39;s &lt;test&gt;'
    expect(escapeHtml(decodeHtmlEntities(encoded))).toBe(encoded)
  })
})
