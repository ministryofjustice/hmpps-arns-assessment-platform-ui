import { block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import type MarkdownIt from 'markdown-it'
import type { Token, Options, Renderer } from 'markdown-it'
import createMarkdownIt from 'markdown-it'
import markdownItAttrs from 'markdown-it-attrs'

/**
 * GOV.UK Markdown Parser
 *
 * Converts markdown to GOV.UK Design System styled HTML.
 * Supports Pandoc-style attribute syntax via markdown-it-attrs: {.class #id attr=value}
 *
 * Mapping:
 * - # H1        → <h1 class="govuk-heading-xl">
 * - ## H2       → <h2 class="govuk-heading-l">
 * - ### H3      → <h3 class="govuk-heading-m">
 * - #### H4     → <h4 class="govuk-heading-s">
 * - paragraph   → <p class="govuk-body">
 * - - list      → <ul class="govuk-list govuk-list--bullet">
 * - 1. list     → <ol class="govuk-list govuk-list--number">
 * - [link](url) → <a class="govuk-link" href="url">
 * - ---         → <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
 * - > quote     → <div class="govuk-inset-text">
 * - `code`      → <code>
 * - | table |   → <table class="govuk-table">
 *
 * Attribute syntax examples:
 * - Paragraph with lead class: `Text {.lead}` → <p class="govuk-body-l">
 * - Custom class on heading: `## Title {.custom}` → <h2 class="govuk-heading-l custom">
 */

type RenderRule = (tokens: Token[], idx: number, options: Options, env: any, self: Renderer) => string

const md: MarkdownIt = createMarkdownIt({
  html: true,
  breaks: false,
  linkify: true,
})

md.use(markdownItAttrs, {
  leftDelimiter: '{',
  rightDelimiter: '}',
  allowedAttributes: ['class', 'id', 'style'],
})

// Store original renderers
const defaultRender: Record<string, RenderRule | undefined> = {
  heading_open: md.renderer.rules.heading_open,
  paragraph_open: md.renderer.rules.paragraph_open,
  bullet_list_open: md.renderer.rules.bullet_list_open,
  ordered_list_open: md.renderer.rules.ordered_list_open,
  link_open: md.renderer.rules.link_open,
}

// Heading sizes
const headingSizes: Record<string, string> = {
  h1: 'xl',
  h2: 'l',
  h3: 'm',
  h4: 's',
  h5: 's',
  h6: 's',
}

// Helper to merge GOV.UK class with any custom classes from attrs
function mergeClasses(govukClass: string, existingClass?: string): string {
  if (!existingClass) {
    return govukClass
  }

  // Handle special class mappings
  if (existingClass.includes('lead')) {
    return existingClass.replace('lead', 'govuk-body-l')
  }

  return `${govukClass} ${existingClass}`
}

// Custom heading renderer
md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const tag = token.tag
  const size = headingSizes[tag] ?? 's'
  const existingClass = token.attrGet('class')
  const govukClass = `govuk-heading-${size}`

  token.attrSet('class', mergeClasses(govukClass, existingClass ?? undefined))

  const defaultRenderer = defaultRender.heading_open
  return defaultRenderer ? defaultRenderer(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options)
}

// Custom paragraph renderer
md.renderer.rules.paragraph_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const existingClass = token.attrGet('class')

  // Check if this is a lead paragraph (has .lead class from attrs)
  if (existingClass?.includes('lead')) {
    token.attrSet('class', existingClass.replace('lead', 'govuk-body-l'))
  } else {
    token.attrSet('class', mergeClasses('govuk-body', existingClass ?? undefined))
  }

  const defaultRenderer = defaultRender.paragraph_open
  return defaultRenderer ? defaultRenderer(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options)
}

// Custom bullet list renderer
md.renderer.rules.bullet_list_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const existingClass = token.attrGet('class')
  token.attrSet('class', mergeClasses('govuk-list govuk-list--bullet', existingClass ?? undefined))

  const defaultRenderer = defaultRender.bullet_list_open
  return defaultRenderer ? defaultRenderer(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options)
}

// Custom ordered list renderer
md.renderer.rules.ordered_list_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const existingClass = token.attrGet('class')
  token.attrSet('class', mergeClasses('govuk-list govuk-list--number', existingClass ?? undefined))

  const defaultRenderer = defaultRender.ordered_list_open
  return defaultRenderer ? defaultRenderer(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options)
}

// Custom link renderer
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const existingClass = token.attrGet('class')
  token.attrSet('class', mergeClasses('govuk-link', existingClass ?? undefined))

  const defaultRenderer = defaultRender.link_open
  return defaultRenderer ? defaultRenderer(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options)
}

// Custom hr renderer
md.renderer.rules.hr = () => {
  return '<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">\n'
}

// Custom blockquote renderer (convert to inset text)
md.renderer.rules.blockquote_open = () => {
  return '<div class="govuk-inset-text">\n'
}

md.renderer.rules.blockquote_close = () => {
  return '</div>\n'
}

// Custom table renderers for GOV.UK styling
md.renderer.rules.table_open = () => {
  return '<table class="govuk-table">\n'
}

md.renderer.rules.thead_open = () => {
  return '<thead class="govuk-table__head">\n'
}

md.renderer.rules.tbody_open = () => {
  return '<tbody class="govuk-table__body">\n'
}

md.renderer.rules.tr_open = () => {
  return '<tr class="govuk-table__row">\n'
}

md.renderer.rules.th_open = (tokens, idx) => {
  const token = tokens[idx]
  const align = token.attrGet('style')

  if (align) {
    return `<th scope="col" class="govuk-table__header" style="${align}">`
  }

  return '<th scope="col" class="govuk-table__header">'
}

md.renderer.rules.td_open = (tokens, idx) => {
  const token = tokens[idx]
  const align = token.attrGet('style')

  if (align) {
    return `<td class="govuk-table__cell" style="${align}">`
  }

  return '<td class="govuk-table__cell">'
}

/**
 * Parse markdown to GOV.UK styled HTML
 *
 * Also handles {{slot:name}} placeholders by removing wrapping <p> tags
 * so TemplateWrapper can properly replace them with slot content.
 */
export function parseGovUKMarkdown(markdown: string): string {
  let html = md.render(markdown.trim())

  // Remove <p> wrapper from slot placeholders
  // e.g. <p class="govuk-body">{{slot:test}}</p> → {{slot:test}}
  html = html.replace(/<p[^>]*>\s*(\{\{slot:[^}]+\}\})\s*<\/p>/g, '$1')

  return html
}

/**
 * Tagged template literal for creating GOV.UK styled HTML blocks from markdown
 *
 * @example
 * ```typescript
 * import { govukMarkdown } from '../helpers/markdown'
 *
 * export const introContent = govukMarkdown`
 * # Page Title
 *
 * This is a lead paragraph. {.lead}
 *
 * Regular paragraph with **bold** and \`code\`.
 *
 * - Bullet point one
 * - Bullet point two
 *
 * > Important information in an inset box
 *
 * ---
 *
 * [A link to somewhere](/path)
 * `
 * ```
 */
export function govukMarkdown(strings: TemplateStringsArray, ...values: unknown[]) {
  const markdown = strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '')

  return block<HtmlBlock>({
    variant: 'html',
    content: parseGovUKMarkdown(markdown),
  })
}

// Also export as `md` for convenience
export { govukMarkdown as md }
