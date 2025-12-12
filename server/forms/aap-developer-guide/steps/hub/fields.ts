import { block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { MOJCardGroup } from '@form-engine-moj-components/index'

/**
 * Welcome introduction for the developer guide
 */
export const welcomeIntro = block<HtmlBlock>({
  variant: 'html',
  content: `
    <p class="govuk-body-l">
      Welcome to the Form Engine Developer Guide. This interactive tutorial teaches you
      how to build forms with the Assessment Platform form-engine.
      <br>// TODO: Give the Form Engine a cool name
    </p>
    <p class="govuk-body">
      Each section below covers a core concept. You can explore them in any order.
      Each concept includes explanations, live demonstrations, and code snippets.
    </p>
  `,
})

/**
 * Card group containing all concept modules
 */
export const conceptCards = block<MOJCardGroup>({
  variant: 'mojCardGroup',
  columns: 3,
  items: [
    {
      heading: '1. Journeys & Steps',
      href: '/forms/form-engine-developer-guide/journeys-and-steps/intro',
      description:
        'Learn how forms are structured as journeys containing steps. Understand the container hierarchy and configuration options.',
    },
    {
      heading: '2. Blocks & Fields',
      href: '/forms/form-engine-developer-guide/blocks-and-fields/intro',
      description:
        'Understand the difference between blocks (display content) and fields (collect answers). See all available variants.',
    },
    {
      heading: '3. References',
      href: '/forms/form-engine-developer-guide/references/intro',
      description:
        'References point to data in the form. Learn about Answer(), Data(), Self(), Item(), Params(), and Post().',
    },
    {
      heading: '4. Conditions',
      href: '/forms/form-engine-developer-guide/conditions/intro',
      description:
        'Conditions test values. Used for validation, field visibility, and conditional logic. See all available condition types.',
    },
    {
      heading: '5. Validation',
      href: '/forms/form-engine-developer-guide/validation/intro',
      description:
        'Define validation rules for fields. Learn about inline, dependent, and submission-only validation with custom messages.',
    },
    {
      heading: '6. Expressions',
      href: '/forms/form-engine-developer-guide/expressions/intro',
      description:
        'Expressions compute values dynamically. Learn Format(), when/then/else, boolean logic (and/or/not), and Collection expressions.',
    },
    {
      heading: '7. Transformers',
      href: '/forms/form-engine-developer-guide/transformers/intro',
      description:
        'Transformers modify field values in a pipeline. See string transformers like Trim, ToUpperCase, and more.',
    },
    {
      heading: '8. Effects',
      href: '/forms/form-engine-developer-guide/effects/intro',
      description:
        'Effects run code at lifecycle points. Load data, save answers, call APIs. Learn defineEffectsWithDeps() and context methods.',
    },
    {
      heading: '9. Transitions',
      href: '/forms/form-engine-developer-guide/transitions/intro',
      description:
        'Transitions control what happens on load and submit. Learn loadTransition, submitTransition, and next() navigation.',
    },
    {
      heading: '10. Collections',
      href: '/forms/form-engine-developer-guide/collections/intro',
      description:
        'Manage lists of items with hub-and-spoke pattern. Add, edit, remove items. Use Item() reference in collection context.',
    },
  ],
})
