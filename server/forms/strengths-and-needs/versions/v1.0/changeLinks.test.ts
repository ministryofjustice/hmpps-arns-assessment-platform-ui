import { questionIdOf } from '../../constants/questionContent'
import { viewAllAnswersSections } from './steps/view-all-answers/sections'

type Node = Record<string, any>

const within = <T>(value: unknown, take: (node: Node) => T | undefined, found: T[] = []): T[] => {
  if (Array.isArray(value)) {
    value.forEach(item => within(item, take, found))
  } else if (value !== null && typeof value === 'object') {
    const taken = take(value as Node)

    if (taken !== undefined) {
      found.push(taken)
    }

    Object.values(value).forEach(item => within(item, take, found))
  }

  return found
}

/**
 * These two tests fail if a newly written question
 * does not conform to expected change link behaviour.
 */
describe.each(viewAllAnswersSections.map(({ section, config }) => [section.code, config]))('%s', (_, config) => {
  const fields = [...Object.values(config?.questions ?? {}), ...Object.values(config?.practitionerAnalysis ?? {})]
  const blocks = within(
    fields.map((field: Node) => field.displayModes?.field),
    node => (node.blockType === 'BlockType.field' ? node : undefined),
  )

  it('gives every question its own id, for a change link to anchor to', () => {
    const ids = blocks.map(block => block.formGroup?.attributes?.id)

    expect(ids).toEqual(blocks.map(block => questionIdOf(block.idPrefix ?? block.code)))
    expect(new Set(ids).size).toEqual(ids.length)
  })

  it('points every summary row change link at one of those questions', () => {
    const rows = fields.flatMap((field: Node) => field.displayModes?.summaryRow ?? [])
    const anchors = within(rows, node => (typeof node.href === 'string' ? node.href.split('#')[1] : undefined))

    expect(anchors).toHaveLength(rows.length)
    expect(anchors.filter(anchor => !blocks.some(block => block.formGroup?.attributes?.id === anchor))).toEqual([])
  })
})
