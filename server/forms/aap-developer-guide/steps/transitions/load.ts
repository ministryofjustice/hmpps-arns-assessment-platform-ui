import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Transitions - Load
 *
 * onLoad transitions for loading data before access checks.
 */
export const loadStep = step({
  path: '/load',
  title: 'Load Transitions',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Load Transitions</h1>

        <p class="govuk-body-l">
          <code>loadTransition()</code> runs effects to load data <strong>before</strong>
          access control checks. This ensures guards have the data they need to make decisions.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Interface</h2>
      `,
    }),

    // Property: effects
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>
        <p class="govuk-body">
          Array of effect functions to execute. All effects run sequentially in order.
          Use <code>context.setData()</code> for reference data and <code>context.setAnswer()</code>
          to pre-populate form fields.
        </p>
        {{slot:code}}
      `,
      values: { name: 'effects' },
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `loadTransition({
  effects: [
    MyEffects.loadUserProfile(),
    MyEffects.loadAssessment(Params('id')),
  ],
})`,
          }),
        ],
      },
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Key Characteristics</h2>

        <ul class="govuk-list govuk-list--bullet">
          <li>
            <strong>ALL execute:</strong> Every <code>loadTransition</code> in the array runs
            (unlike other transitions which use first-match)
          </li>
          <li>
            <strong>No conditions:</strong> Load transitions don't have <code>when</code> or
            <code>guards</code> &mdash; they always run
          </li>
          <li>
            <strong>Order matters:</strong> Effects execute in array order, sequentially
          </li>
          <li>
            <strong>Effects can set Data and Answers:</strong> Use <code>context.setData()</code>
            for supplementary data (API responses, reference data) and <code>context.setAnswer()</code>
            to pre-populate form fields (e.g., loading saved drafts)
          </li>
        </ul>
      `,
    }),

    // Journey-level example
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Journey-Level Loading</h2>
        <p class="govuk-body">
          Load data needed across <strong>all steps</strong> in the journey.
          Journey <code>onLoad</code> runs once when entering the journey.
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `journey({
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
})`,
          }),
        ],
      },
    }),

    // Step-level example
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Step-Level Loading</h2>
        <p class="govuk-body">
          Load data specific to a single step. Step <code>onLoad</code> runs
          each time the step is accessed.
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `step({
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
})`,
          }),
        ],
      },
    }),

    // Multiple loaders
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Multiple Load Transitions</h2>
        <p class="govuk-body">
          Since ALL load transitions execute, you can organize related loads
          into separate transitions for clarity:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `onLoad: [
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
],`,
          }),
        ],
      },
    }),

    // Best practices
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Best Practices</h2>

        <ul class="govuk-list govuk-list--bullet">
          <li>
            <strong>Journey vs Step:</strong> Load shared data at journey level,
            step-specific data at step level
          </li>
          <li>
            <strong>Keep effects focused:</strong> Each effect should do one thing well
          </li>
          <li>
            <strong>Let errors throw:</strong> If something fundamental fails (API down,
            missing data), just throw &mdash; don't silently swallow errors
          </li>
          <li>
            <strong>Avoid duplication:</strong> Don't reload at step level what's already
            loaded at journey level
          </li>
        </ul>
      `,
    }),

    // Navigation
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        {{slot:pagination}}
      `,
      slots: {
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
    }),
  ],
})
