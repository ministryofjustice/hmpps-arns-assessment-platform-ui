import { expect as baseExpect, type Page } from '@playwright/test'

// Text inputs and textareas are intentionally excluded from interaction tracking.
const INTERACTIVE_ELEMENT_SELECTOR = [
  'a[href]',
  'area[href]',
  'button',
  'input[type="button" i]',
  'input[type="checkbox" i]',
  'input[type="radio" i]',
  'input[type="reset" i]',
  'input[type="submit" i]',
  'select',
  'summary',
].join(', ')

interface MissingControlTag {
  description: string
  html: string
}

const collectMissingControlTags = async (page: Page): Promise<MissingControlTag[]> =>
  page.locator(INTERACTIVE_ELEMENT_SELECTOR).evaluateAll(elements => {
    const describeElement = (element: Element): string => {
      const tagName = element.tagName.toLowerCase()
      const type = element.getAttribute('type')
      const role = element.getAttribute('role')
      const elementType = `<${tagName}${type ? ` type="${type}"` : ''}${role ? ` role="${role}"` : ''}>`
      const labels = element instanceof HTMLInputElement ? Array.from(element.labels ?? []) : []
      const labelText = labels.map(label => label.innerText).join(' ')
      const readableName =
        element.getAttribute('aria-label') ||
        labelText ||
        element.textContent ||
        element.getAttribute('value') ||
        element.getAttribute('name') ||
        ''
      const normalisedName = readableName.replace(/\s+/g, ' ').trim().slice(0, 100)

      return `${elementType}${normalisedName ? ` "${normalisedName}"` : ''}`
    }

    return elements
      .filter(element => !element.getAttribute('data-ai-id')?.trim())
      .map(element => ({
        description: describeElement(element),
        html: element.outerHTML.replace(/\s+/g, ' ').slice(0, 300),
      }))
  })

const formatMissingControlTags = (page: Page, findings: MissingControlTag[]): string => {
  const details = findings.map(({ description, html }, index) => `${index + 1}. ${description}\n   HTML: ${html}`)

  return [
    `${findings.length} interactive element${findings.length === 1 ? '' : 's'} missing a non-empty data-ai-id on ${page.url()}:`,
    ...details,
  ].join('\n')
}

export const expect = baseExpect.extend({
  async toHaveDataTags(page: Page) {
    const missingControlTags = await collectMissingControlTags(page)
    const pass = missingControlTags.length === 0

    return {
      pass,
      message: () =>
        pass
          ? `Expected ${page.url()} to contain a control without a data-ai-id`
          : formatMissingControlTags(page, missingControlTags),
    }
  },
})
