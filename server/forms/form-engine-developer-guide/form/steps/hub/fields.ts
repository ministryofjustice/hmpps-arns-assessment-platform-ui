import { TemplateWrapper } from '@form-engine/registry/components'
import { MOJCardGroup } from '@form-engine-moj-components/components'
import { parseGovUKMarkdown } from '../../../helpers/markdown'

/**
 * Welcome introduction for the developer guide
 */
export const welcomeIntro = TemplateWrapper({
  template: parseGovUKMarkdown(`
    Welcome to the Form Engine Developer Guide. This interactive tutorial teaches you
    how to build forms with the Assessment Platform form-engine. {.lead}

    Each section below covers a core concept. You can explore them in any order.
    Each concept includes explanations, live demonstrations, and code snippets.
  `),
})

/**
 * Card group containing all concept modules
 */
export const conceptCards = MOJCardGroup({
  columns: 3,
  items: [
    {
      heading: '1. Form Registration',
      href: '/forms/form-engine-developer-guide/form-registration/intro',
      description:
        'Learn how to structure and register forms. Understand form packages, directory organization, and dependency injection.',
    },
    {
      heading: '2. Journeys & Steps',
      href: '/forms/form-engine-developer-guide/journeys-and-steps/intro',
      description:
        'Learn how forms are structured as journeys containing steps. Understand the container hierarchy and configuration options.',
    },
    {
      heading: '3. Blocks & Fields',
      href: '/forms/form-engine-developer-guide/blocks-and-fields/intro',
      description:
        'Understand the difference between blocks (display content) and fields (collect answers). See all available variants.',
    },
    {
      heading: '4. Components',
      href: '/forms/form-engine-developer-guide/components/intro',
      description:
        'Understand the component system. Learn about built-in components, how to build custom ones, and how to extend existing components.',
    },
    {
      heading: '5. References',
      href: '/forms/form-engine-developer-guide/references/intro',
      description:
        'References point to data in the form. Learn about Answer(), Data(), Self(), Item(), Params(), and Post().',
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
      heading: '8. Generators',
      href: '/forms/form-engine-developer-guide/generators/intro',
      description: 'Generate dynamic values like dates, UUIDs, and more. Use generators to create values at runtime.',
    },
    {
      heading: '9. Iterators',
      href: '/forms/form-engine-developer-guide/iterators/intro',
      description:
        'Transform, filter, and search arrays with chainable iterators. Use Iterator.Map, Iterator.Filter, and Iterator.Find with Item() references.',
    },
    {
      heading: '10. Conditions',
      href: '/forms/form-engine-developer-guide/conditions/intro',
      description:
        'Conditions test values. Used for validation, field visibility, and conditional logic. See all available condition types.',
    },
    {
      heading: '11. Validation',
      href: '/forms/form-engine-developer-guide/validation/intro',
      description:
        'Define validation rules for fields. Learn about inline, dependent, and submission-only validation with custom messages.',
    },
    {
      heading: '12. Effects',
      href: '/forms/form-engine-developer-guide/effects/intro',
      description:
        'Effects run code at lifecycle points. Load data, save answers, call APIs. Learn defineEffectsWithDeps() and context methods.',
    },
    {
      heading: '13. Transitions',
      href: '/forms/form-engine-developer-guide/transitions/intro',
      description:
        'Transitions control access, actions, and submission. Learn accessTransition, submitTransition, redirect(), and throwError().',
    },
    {
      heading: '14. Recipes',
      href: '/forms/form-engine-developer-guide/recipes/intro',
      description:
        'Quick reference patterns for common tasks. Copy-paste ready examples for conditional visibility, validation, loading data, and more.',
    },
  ],
})
