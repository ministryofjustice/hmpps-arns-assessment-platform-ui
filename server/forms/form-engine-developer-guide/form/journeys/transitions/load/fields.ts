import { block } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Transitions - Load
 *
 * onLoad transitions for loading data before access checks.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Load Transitions

  \`loadTransition()\` runs effects to load data **before**
  access control checks. This ensures guards have the data they need to make decisions. {.lead}

  ---

  ## Interface

  <h3 class="govuk-heading-s"><code>effects</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>

  Array of effect functions to execute. All effects run sequentially in order.
  Use \`context.setData()\` for reference data and \`context.setAnswer()\`
  to pre-populate form fields.

  {{slot:effectsCode}}

  ---

  ## Key Characteristics

  - **ALL execute:** Every \`loadTransition\` in the array runs
    (unlike other transitions which use first-match)
  - **No conditions:** Load transitions don't have \`when\` or
    \`guards\` — they always run
  - **Order matters:** Effects execute in array order, sequentially
  - **Effects can set Data and Answers:** Use \`context.setData()\`
    for supplementary data (API responses, reference data) and \`context.setAnswer()\`
    to pre-populate form fields (e.g., loading saved drafts)

  ---

  ## Journey-Level Loading

  Load data needed across **all steps** in the journey.
  Journey \`onLoad\` runs once when entering the journey.

  {{slot:journeyLoadCode}}

  ---

  ## Step-Level Loading

  Load data specific to a single step. Step \`onLoad\` runs
  each time the step is accessed.

  {{slot:stepLoadCode}}

  ---

  ## Multiple Load Transitions

  Since ALL load transitions execute, you can organize related loads
  into separate transitions for clarity:

  {{slot:multipleLoadCode}}

  ---

  ## Best Practices

  - **Journey vs Step:** Load shared data at journey level,
    step-specific data at step level
  - **Keep effects focused:** Each effect should do one thing well
  - **Let errors throw:** If something fundamental fails (API down,
    missing data), just throw — don't silently swallow errors
  - **Avoid duplication:** Don't reload at step level what's already
    loaded at journey level

  ---

  {{slot:pagination}}
`),
  slots: {
    effectsCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          loadTransition({
            effects: [
              MyEffects.loadUserProfile(),
              MyEffects.loadAssessment(Params('id')),
            ],
          })
        `,
      }),
    ],
    journeyLoadCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          journey({
            code: 'assessment',
            path: '/assessment',

            onLoad: [
              // Load user profile - needed for permissions
              loadTransition({
                effects: [MyEffects.loadUserProfile()],
              }),
              // Load assessment data - needed across all steps
              loadTransition({
                effects: [MyEffects.loadAssessment(Params('id'))],
              }),
            ],

            onAccess: [
              // Now guards can reference Data('user') and Data('assessment')
              accessTransition({
                guards: Data('user.canViewAssessment').match(Condition.Equals(true)),
                redirect: [next({ goto: '/unauthorized' })],
              }),
            ],

            steps: [/* ... */],
          })
        `,
      }),
    ],
    stepLoadCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          step({
            path: '/accommodation',
            title: 'Accommodation Details',

            onLoad: [
              loadTransition({
                effects: [
                  // Load reference data for dropdowns
                  MyEffects.loadAccommodationTypes(),
                  // Load any saved draft answers
                  MyEffects.loadDraftAnswers('accommodation'),
                ],
              }),
            ],

            blocks: [
              // Fields can now use Data('accommodationTypes') for options
              field<GovUKRadioInput>({
                variant: 'govukRadioInput',
                code: 'accommodationType',
                fieldset: {
                  legend: { text: 'What type of accommodation?' },
                },
                items: Data('accommodationTypes'),
              }),
            ],
          })
        `,
      }),
    ],
    multipleLoadCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          onLoad: [
            // Core data
            loadTransition({
              effects: [MyEffects.loadAssessment(Params('id'))],
            }),

            // Reference data
            loadTransition({
              effects: [
                MyEffects.loadRiskCategories(),
                MyEffects.loadInterventionTypes(),
              ],
            }),

            // User context
            loadTransition({
              effects: [MyEffects.loadUserPermissions()],
            }),
          ],
        `,
      }),
    ],
    pagination: [
      block<GovUKPagination>({
        variant: 'govukPagination',
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/transitions/intro',
          labelText: 'Introduction',
        },
        next: {
          href: '/forms/form-engine-developer-guide/transitions/access',
          labelText: 'Access Transitions',
        },
      }),
    ],
  },
})
