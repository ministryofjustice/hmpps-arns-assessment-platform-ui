import { convertToTitleCase, formatDate, initialiseName } from './utils'

describe('convert to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe('formatDate', () => {
  it('returns ISO format for valid date with "iso" format', () => {
    expect(formatDate('1990-01-01', 'iso')).toBe('1990-01-01')
  })

  it('returns simple format for valid date with "simple" format', () => {
    expect(formatDate('1990-01-01', 'simple')).toBe('1 January 1990')
  })

  it('returns simple format for valid date with "simple" format', () => {
    expect(formatDate(null, 'simple')).toBe('')
  })

  it('returns empty string for invalid date', () => {
    expect(formatDate('invalid-date', 'iso')).toBe('')
  })

  it('returns empty string for empty date string', () => {
    expect(formatDate('', 'iso')).toBe('')
  })

  it('returns simple format for valid date with default format', () => {
    // @ts-expect-error we expect a linting error here, the second argument is intentionally invalid
    expect(formatDate('1990-01-01', 'unknown')).toBe('1 January 1990')
  })
})
