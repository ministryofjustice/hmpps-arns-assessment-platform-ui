import type nunjucks from 'nunjucks'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import scss from 'highlight.js/lib/languages/scss'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import yaml from 'highlight.js/lib/languages/yaml'
import markdown from 'highlight.js/lib/languages/markdown'
import plaintext from 'highlight.js/lib/languages/plaintext'
import { BlockDefinition, ConditionalString, EvaluatedBlock } from '@form-engine/form/types/structures.type'
import { buildNunjucksComponent } from '@form-engine-express-nunjucks/utils/buildNunjucksComponent'

// Register languages for SSR highlighting
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('scss', scss)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('plaintext', plaintext)

/**
 * Supported programming languages for syntax highlighting.
 * These map to highlight.js language identifiers.
 */
export type CodeLanguage =
  | 'typescript'
  | 'javascript'
  | 'html'
  | 'css'
  | 'scss'
  | 'json'
  | 'bash'
  | 'shell'
  | 'yaml'
  | 'markdown'
  | 'plaintext'

/**
 * Code Block component for displaying syntax-highlighted code.
 *
 * Renders code with server-side syntax highlighting via highlight.js.
 * The HTML is pre-highlighted during SSR - no client-side JS required.
 *
 * @example
 * ```typescript
 * block<CodeBlock>({
 *   variant: 'codeBlock',
 *   language: 'typescript',
 *   code: `journey({
 *     code: 'my-form',
 *     title: 'My Form',
 *     path: '/my-form',
 *   })`,
 * })
 * ```
 */
export interface CodeBlock extends BlockDefinition {
  variant: 'codeBlock'

  /** The code to display */
  code: ConditionalString

  /** Programming language for syntax highlighting (defaults to 'typescript') */
  language?: CodeLanguage

  /** Additional CSS classes for the container */
  classes?: ConditionalString

  /** Whether to remove common leading whitespace from all lines (defaults to true) */
  dedent?: boolean
}

/**
 * Escapes HTML entities for text that won't be highlighted.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Removes common leading whitespace from all lines.
 * Finds the minimum indentation across non-empty lines and removes it from all lines.
 */
function dedentCode(text: string): string {
  const lines = text.split('\n')

  // Find minimum indentation (ignoring empty lines)
  const indents = lines
    .filter(line => line.trim().length > 0)
    .map(line => {
      const match = line.match(/^(\s*)/)
      return match ? match[1].length : 0
    })

  const minIndent = indents.length > 0 ? Math.min(...indents) : 0

  if (minIndent === 0) {
    return text
  }

  // Remove the common indentation from each line
  return lines.map(line => line.slice(minIndent)).join('\n')
}

/**
 * Renders the code block component with SSR syntax highlighting.
 */
export const codeBlock = buildNunjucksComponent<CodeBlock>(
  'codeBlock',
  async (block: EvaluatedBlock<CodeBlock>, nunjucksEnv: nunjucks.Environment) => {
    const language = block.language || 'typescript'
    const shouldDedent = block.dedent !== false
    const classes = ['code-block', block.classes].filter(Boolean).join(' ')

    // Trim leading/trailing newlines that occur from template literal formatting
    let code = block.code.replace(/^\n/, '').replace(/\n\s*$/, '')

    // Remove common leading whitespace if dedent is enabled (default)
    if (shouldDedent) {
      code = dedentCode(code)
    }

    // Apply syntax highlighting server-side
    let highlightedCode: string

    try {
      const result = hljs.highlight(code, { language })
      highlightedCode = result.value
    } catch {
      // Fallback to escaped plain text if highlighting fails
      highlightedCode = escapeHtml(code)
    }

    return nunjucksEnv.render('form-engine-developer-guide/components/code-block/template.njk', {
      params: { code: highlightedCode, language, classes },
    })
  },
)
