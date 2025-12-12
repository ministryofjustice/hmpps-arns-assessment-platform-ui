/**
 * Shared option definitions for the standup demo form
 * Used both for rendering fields and for label lookups in summaries
 */

export const coldDecisionOptions = [
  {
    value: 'continue',
    text: 'Soldier on and demonstrate the AAP',
    hint: 'The show must go on, but all communication will now be through this form',
  },
  {
    value: 'bed',
    text: 'Log off and go back to bed',
    hint: 'A sensible choice that will be ignored',
  },
]

export const squadOptions = [
  {
    value: 'squad-1',
    text: 'Squad 1',
    hint: 'Do these guys have an animal name?',
  },
  {
    value: 'phoenix',
    text: 'Squad 2 (Phoenix)',
  },
  {
    value: 'hippo',
    text: 'Squad 3 (Hippo)',
  },
  {
    value: 'koala',
    text: 'Squad 4 (Koala)',
  },
]

export const squad4ProgressOptions = [
  {
    value: 'prs',
    text: 'Bunch of PRs for folks to review that fix loads of bugs',
  },
  {
    value: 'aap-backend',
    text: 'Hooked up forms into the AAP backend, with added/removed working correctly (this form included)',
  },
  {
    value: 'form-router',
    text: 'Form router is now setup and properly shifts you around',
  },
  {
    value: 'ai-form',
    text: 'Used AI to create this example form in like, 20 minutes',
    hint: 'I intend to never write forms again',
  },
  {
    value: 'step-renderer',
    text: 'Finish getting all info from form into step renderer so we can do backlinks and navigation',
    hint: 'Still in progress',
  },
  {
    value: 'reachability',
    text: 'Implement reachability checks',
    hint: 'Coming soon',
  },
]

export const squad2ProgressOptions = [
  {
    value: 'step-renderer',
    text: 'Step renderer is nearly finished',
    hint: 'Folks can start building components soon (this is literally how you are seeing this)',
  },
  {
    value: 'block-rendering',
    text: 'Block rendering pipeline complete',
  },
  {
    value: 'field-state',
    text: 'Field state management working with validation errors',
  },
  {
    value: 'govuk-components',
    text: 'Basic GovUK component library integration',
    hint: 'Text inputs, radios, checkboxes, date inputs all working',
  },
  {
    value: 'template-context',
    text: 'Template context properly populated for Nunjucks',
    hint: 'In progress, used for navigation style stuff!',
  },
  {
    value: 'govuk-components-2',
    text: 'Rest of the GovUK component library',
    hint: 'Theres still a tonne more to add, we can add these as we need them though',
  },
  {
    value: 'backlinks',
    text: 'Backlinks',
    hint: 'In progress',
  },
]

/**
 * Helper to convert options array to a value->text lookup map
 */
export function toLabelMap(options: Array<{ value: string; text: string }>): Record<string, string> {
  return Object.fromEntries(options.map(opt => [opt.value, opt.text]))
}

/**
 * Map an array of values to their labels, or a single value to its label
 */
export function mapToLabels(
  values: string | string[] | undefined,
  options: Array<{ value: string; text: string }>,
): string {
  if (!values) {
    return 'None selected'
  }

  const labelMap = toLabelMap(options)

  if (Array.isArray(values)) {
    return values.map(v => labelMap[v] || v).join(', ')
  }

  return labelMap[values] || values
}
