import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Custom Effects
 *
 * How to build, register, and use your own effect functions with dependency injection.
 */
export const customStep = step({
  path: '/custom',
  title: 'Custom Effects',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Building Custom Effects</h1>

        <p class="govuk-body-l">
          Custom effects let you define reusable side effect functions that integrate
          seamlessly with the form-engine transition system.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">When to Build Custom Effects</h2>

        <p class="govuk-body">
          Create custom effects when you need:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li>API integration for loading and saving data</li>
          <li>External service calls (postcode lookup, email, notifications)</li>
          <li>Session or state management</li>
          <li>Analytics tracking and logging</li>
          <li>Complex data transformation during save</li>
          <li>Reusable lifecycle operations across multiple forms</li>
        </ul>
      `,
    }),

    // Defining Effects Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Defining Custom Effects</h2>
        <p class="govuk-body">
          Use <code>defineEffects()</code> for simple effects without external dependencies.
          Each effect receives a <code>context</code> object and optional arguments.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `import { defineEffects } from '@form-engine/registry/utils/createRegisterableFunction'
import EffectFunctionContext from '@form-engine/core/ast/thunks/EffectFunctionContext'

export const { effects: MyEffects, registry: MyEffectsRegistry } = defineEffects({
  // Simple effect - no parameters
  InitializeSession: (context: EffectFunctionContext) => {
    const session = context.getSession()
    if (!session.startedAt) {
      session.startedAt = new Date().toISOString()
      session.stepsCompleted = []
    }
  },

  // Effect with parameters
  TrackStepComplete: (context: EffectFunctionContext, stepName: string) => {
    const session = context.getSession()
    if (!session.stepsCompleted.includes(stepName)) {
      session.stepsCompleted.push(stepName)
    }
    console.log(\`Step completed: \${stepName}\`)
  },

  // Async effect
  LoadData: async (context: EffectFunctionContext, endpoint: string) => {
    const response = await fetch(endpoint)
    const data = await response.json()
    context.setData('loadedData', data)
  },
})`,
    }),

    // Function Signature Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Effect Function Signature</h2>
        <p class="govuk-body">
          Every effect function follows this pattern:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Signature
(context: EffectFunctionContext, ...args: ValueExpr[]) => void | Promise<void>

// The first parameter is always the context object
// Additional parameters are arguments passed to the effect
// Can return void or a Promise for async operations

// Examples:

// No parameters
LogFormStart: (context) => {
  console.log('Form started:', context.getSession().id)
}

// Single parameter
SaveSection: async (context, sectionName: string) => {
  const answers = context.getAnswers()
  await api.saveSection(sectionName, answers)
}

// Multiple parameters
SendNotification: (context, type: 'email' | 'sms', template: string) => {
  const user = context.getData('user')
  notificationService.send(type, template, user)
}`,
    }),

    // Dependency Injection Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Dependency Injection</h2>
        <p class="govuk-body">
          For effects that need external services (API clients, database connections, etc.),
          use <code>defineEffectsWithDeps()</code>. This separates effect definition from
          dependency wiring.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `import { defineEffectsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
import EffectFunctionContext from '@form-engine/core/ast/thunks/EffectFunctionContext'
import type { AssessmentApiClient } from './services/assessmentApi'
import type { Logger } from './services/logger'

// 1. Define the dependencies interface
interface MyEffectsDeps {
  api: AssessmentApiClient
  logger: Logger
}

// 2. Define effects using the curried pattern
export const { effects: MyEffects, createRegistry: createMyEffectsRegistry } =
  defineEffectsWithDeps<MyEffectsDeps>()({
    // Each effect is a factory: (deps) => (context, ...args) => void
    LoadAssessment: deps => async (context: EffectFunctionContext, assessmentId: string) => {
      deps.logger.info(\`Loading assessment: \${assessmentId}\`)
      const assessment = await deps.api.getAssessment(assessmentId)
      context.setData('assessment', assessment)

      // Pre-populate answers from saved data
      Object.entries(assessment.answers).forEach(([code, value]) => {
        context.setAnswer(code, value)
      })
    },

    SaveAnswers: deps => async (context: EffectFunctionContext) => {
      const assessmentId = context.getData('assessment').id
      const answers = context.getAnswers()

      await deps.api.saveAnswers(assessmentId, answers)
      deps.logger.info(\`Answers saved for: \${assessmentId}\`)
    },

    CompleteSection: deps => async (context: EffectFunctionContext, section: string) => {
      const assessmentId = context.getData('assessment').id
      await deps.api.completeSection(assessmentId, section)
      context.setData(\`\${section}.completed\`, true)
      deps.logger.info(\`Section completed: \${section}\`)
    },
  })`,
    }),

    // Registration Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Registering Custom Effects</h2>
        <p class="govuk-body">
          After defining your effects, register them with the form engine. The pattern
          differs slightly depending on whether you used <code>defineEffects</code>
          or <code>defineEffectsWithDeps</code>.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'Without dependencies (defineEffects)',
      code: `// effects/myEffects.ts
import { defineEffects } from '@form-engine/registry/utils/createRegisterableFunction'

export const { effects: MyEffects, registry: MyEffectsRegistry } = defineEffects({
  InitializeSession: (context) => {
    // ...
  },
})

// app.ts
import FormEngine from '@form-engine/core/FormEngine'
import { MyEffectsRegistry } from './effects/myEffects'

const formEngine = new FormEngine({ /* ... */ })
  .registerFunctions(MyEffectsRegistry)`,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'With dependencies (defineEffectsWithDeps)',
      code: `// effects/myEffects.ts
import { defineEffectsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'

export const { effects: MyEffects, createRegistry: createMyEffectsRegistry } =
  defineEffectsWithDeps<MyEffectsDeps>()({
    LoadAssessment: deps => async (context, id) => {
      // ...
    },
  })

// app.ts
import FormEngine from '@form-engine/core/FormEngine'
import { createMyEffectsRegistry } from './effects/myEffects'
import { assessmentApiClient } from './services/assessmentApi'
import { logger } from './services/logger'

// Create registry with real dependencies at runtime
const myEffectsRegistry = createMyEffectsRegistry({
  api: assessmentApiClient,
  logger: logger,
})

const formEngine = new FormEngine({ /* ... */ })
  .registerFunctions(myEffectsRegistry)`,
    }),

    // Using Custom Effects Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Using Custom Effects in Forms</h2>
        <p class="govuk-body">
          Import and use your custom effects in transition definitions. The effect builders
          don't need dependencies &mdash; those are wired at registration time.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `import { loadTransition, submitTransition, actionTransition, next, Params, Post } from '@form-engine/form/builders'
import { MyEffects } from './effects/myEffects'

step({
  path: '/assessment/:id',
  title: 'Assessment Details',

  onLoad: [
    loadTransition({
      effects: [
        // Pass URL parameter as argument
        MyEffects.LoadAssessment(Params('id')),
      ],
    }),
  ],

  onAction: [
    actionTransition({
      when: Post('action').match(Condition.Equals('lookup')),
      effects: [
        // Pass POST value as argument
        MyEffects.LookupPostcode(Post('postcode')),
      ],
    }),
  ],

  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {
        effects: [
          MyEffects.SaveAnswers(),
          MyEffects.CompleteSection('personal-details'),
        ],
        next: [next({ goto: 'next-step' })],
      },
      onInvalid: {
        effects: [
          MyEffects.SaveDraft(),
        ],
      },
    }),
  ],

  blocks: [/* ... */],
})`,
    }),

    // Organising Effects Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Organising Custom Effects</h2>
        <p class="govuk-body">
          For larger projects, organise effects by domain into separate files,
          then combine them into a single registry.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'effects/index.ts (without dependencies)',
      code: `// Import individual effect sets (all using defineEffects)
import { SessionEffects, SessionEffectsRegistry } from './sessionEffects'
import { AnalyticsEffects, AnalyticsEffectsRegistry } from './analyticsEffects'
import { NotificationEffects, NotificationEffectsRegistry } from './notificationEffects'

// Export combined effects object for use in forms
export const MyEffects = {
  Session: SessionEffects,
  Analytics: AnalyticsEffects,
  Notification: NotificationEffects,
}

// Export combined registry for registration
export const MyEffectsRegistry = {
  ...SessionEffectsRegistry,
  ...AnalyticsEffectsRegistry,
  ...NotificationEffectsRegistry,
}`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <p class="govuk-body govuk-!-margin-top-4">
          When mixing effects that need dependencies with those that don't, export a
          <code>createRegistry</code> function that accepts the required dependencies:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'effects/index.ts (with dependencies)',
      code: `// Some effects use defineEffects (no deps)
import { SessionEffects, SessionEffectsRegistry } from './sessionEffects'
import { AnalyticsEffects, AnalyticsEffectsRegistry } from './analyticsEffects'

// Some effects use defineEffectsWithDeps (need deps)
import {
  ApiEffects,
  createApiEffectsRegistry,
  type ApiEffectsDeps,
} from './apiEffects'

// Export combined effects object for use in forms
// (effect builders don't need deps, so this is straightforward)
export const MyEffects = {
  Session: SessionEffects,
  Analytics: AnalyticsEffects,
  Api: ApiEffects,
}

// Export a factory that creates the combined registry
// Call this at app startup with the required dependencies
export const createMyEffectsRegistry = (deps: ApiEffectsDeps) => ({
  ...SessionEffectsRegistry,           // No deps needed
  ...AnalyticsEffectsRegistry,         // No deps needed
  ...createApiEffectsRegistry(deps),   // Deps required
})

// Re-export the deps type for consumers
export type { ApiEffectsDeps as MyEffectsDeps }`,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'Usage in forms',
      code: `import { MyEffects } from './effects'

// Use namespaced effects (same as before - no deps needed here)
onLoad: [
  loadTransition({
    effects: [
      MyEffects.Session.Initialize(),
      MyEffects.Api.LoadAssessment(Params('id')),
    ],
  }),
],

onSubmission: [
  submitTransition({
    validate: true,
    onValid: {
      effects: [
        MyEffects.Api.SaveAnswers(),
        MyEffects.Analytics.TrackSubmission('personal-details'),
      ],
      next: [next({ goto: 'next-step' })],
    },
  }),
],`,
    }),

    // Error Handling Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Error Handling</h2>
        <p class="govuk-body">
          Effects should handle errors appropriately. For critical operations, let errors
          propagate to stop form progression. For non-critical operations, handle gracefully.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `export const { effects, createRegistry } = defineEffectsWithDeps<MyDeps>()({
  // Critical: let errors propagate
  SaveAnswers: deps => async (context) => {
    // If this fails, form submission should stop
    await deps.api.save(context.getAnswers())
  },

  // Non-critical: handle gracefully
  TrackAnalytics: deps => async (context, event: string) => {
    try {
      await deps.analytics.track(event, {
        sessionId: context.getSession().id,
        step: context.getCurrentStep().path,
      })
    } catch (error) {
      // Log but don't block form progression
      deps.logger.warn(\`Analytics failed: \${error.message}\`)
    }
  },

  // With retry logic
  SaveWithRetry: deps => async (context) => {
    const maxRetries = 3
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await deps.api.save(context.getAnswers())
        return // Success
      } catch (error) {
        lastError = error as Error
        deps.logger.warn(\`Save attempt \${attempt} failed: \${lastError.message}\`)
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
      }
    }

    // All retries failed
    throw lastError
  },
})`,
    }),

    // Best Practices Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Best Practices</h2>

        <ol class="govuk-list govuk-list--number">
          <li>
            <strong>Use dependency injection</strong> &mdash; Prefer <code>defineEffectsWithDeps</code>
            for effects that need external services. This makes testing easier and keeps dependencies explicit.
          </li>
          <li>
            <strong>Keep effects focused</strong> &mdash; Each effect should do one thing well.
            Split complex operations into multiple smaller effects.
          </li>
          <li>
            <strong>Design for idempotency</strong> &mdash; Where possible, make effects safe to
            run multiple times (e.g., check if action already done before repeating).
          </li>
          <li>
            <strong>Name descriptively</strong> &mdash; Use verb prefixes like <code>Load*</code>,
            <code>Save*</code>, <code>Send*</code>, <code>Track*</code>, <code>Initialize*</code>
            so the purpose is clear.
          </li>
          <li>
            <strong>Handle errors appropriately</strong> &mdash; Let critical errors propagate,
            handle non-critical errors gracefully. Log useful context for debugging.
          </li>
          <li>
            <strong>Avoid blocking operations</strong> &mdash; If an effect calls a slow API,
            consider whether it's truly needed at that lifecycle point.
          </li>
          <li>
            <strong>Use clear data namespacing</strong> &mdash; When using <code>setData()</code>,
            use clear keys that won't conflict (e.g., <code>'assessment.personal.completed'</code>).
          </li>
        </ol>
      `,
    }),

    // Complete Example Section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Complete Example</h2>
        <p class="govuk-body">
          Here's a complete example of a custom effects set for an assessment form:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'effects/assessmentEffects.ts',
      code: `import { defineEffectsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
import EffectFunctionContext from '@form-engine/core/ast/thunks/EffectFunctionContext'
import type { AssessmentApiClient } from '../services/assessmentApi'
import type { Logger } from '../services/logger'

/**
 * Dependencies for assessment effects
 */
export interface AssessmentEffectsDeps {
  api: AssessmentApiClient
  logger: Logger
}

/**
 * Custom effects for assessment forms
 *
 * Usage:
 * - Import \`AssessmentEffects\` for step definitions (no deps needed)
 * - Import \`createAssessmentEffectsRegistry\` for app.ts (pass real deps)
 */
export const { effects: AssessmentEffects, createRegistry: createAssessmentEffectsRegistry } =
  defineEffectsWithDeps<AssessmentEffectsDeps>()({
    /**
     * Load assessment data from API
     * Sets both data (full assessment) and answers (form fields)
     */
    LoadAssessment: deps => async (context: EffectFunctionContext, assessmentId: string) => {
      deps.logger.info(\`Loading assessment: \${assessmentId}\`)

      const assessment = await deps.api.getAssessment(assessmentId)
      context.setData('assessment', assessment)

      // Pre-populate form fields with saved answers
      Object.entries(assessment.answers || {}).forEach(([code, value]) => {
        context.setAnswer(code, value)
      })

      deps.logger.info(\`Assessment loaded with \${Object.keys(assessment.answers || {}).length} answers\`)
    },

    /**
     * Save current answers to API
     * Calculates delta to avoid saving unchanged data
     */
    SaveAnswers: deps => async (context: EffectFunctionContext) => {
      const assessment = context.getData('assessment')
      const currentAnswers = context.getAnswers()

      await deps.api.saveAnswers(assessment.id, currentAnswers)
      deps.logger.info(\`Answers saved for assessment: \${assessment.id}\`)
    },

    /**
     * Save as draft (no validation required)
     */
    SaveDraft: deps => async (context: EffectFunctionContext) => {
      const assessment = context.getData('assessment')
      const currentAnswers = context.getAnswers()

      await deps.api.saveDraft(assessment.id, currentAnswers)
      deps.logger.info(\`Draft saved for assessment: \${assessment.id}\`)
    },

    /**
     * Mark a section as complete
     */
    CompleteSection: deps => async (context: EffectFunctionContext, section: string) => {
      const assessment = context.getData('assessment')

      await deps.api.completeSection(assessment.id, section)
      context.setData(\`sections.\${section}.completed\`, true)

      deps.logger.info(\`Section completed: \${section}\`)
    },

    /**
     * Perform postcode lookup and populate address fields
     */
    LookupPostcode: deps => async (context: EffectFunctionContext, postcode: string) => {
      if (!postcode || postcode.trim() === '') {
        return
      }

      deps.logger.info(\`Looking up postcode: \${postcode}\`)

      try {
        const address = await deps.api.lookupPostcode(postcode)

        if (address) {
          context.setAnswer('addressLine1', address.line1)
          context.setAnswer('town', address.town)
          context.setAnswer('county', address.county)
          deps.logger.info(\`Address found for postcode: \${postcode}\`)
        } else {
          context.setData('postcodeError', 'Address not found')
        }
      } catch (error) {
        deps.logger.warn(\`Postcode lookup failed: \${(error as Error).message}\`)
        context.setData('postcodeError', 'Lookup service unavailable')
      }
    },

    /**
     * Submit the completed assessment
     */
    SubmitAssessment: deps => async (context: EffectFunctionContext) => {
      const assessment = context.getData('assessment')
      const currentAnswers = context.getAnswers()

      const result = await deps.api.submitAssessment(assessment.id, currentAnswers)

      context.setData('submission', {
        id: result.submissionId,
        timestamp: result.timestamp,
        success: true,
      })

      deps.logger.info(\`Assessment submitted: \${result.submissionId}\`)
    },
  })`,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      title: 'Usage in a form step',
      code: `import { step, loadTransition, submitTransition, actionTransition, next, Params, Post } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { AssessmentEffects } from './effects/assessmentEffects'

export const personalDetailsStep = step({
  path: '/personal-details',
  title: 'Personal Details',

  onLoad: [
    loadTransition({
      effects: [
        AssessmentEffects.LoadAssessment(Params('assessmentId')),
      ],
    }),
  ],

  onAction: [
    actionTransition({
      when: Post('action').match(Condition.Equals('lookup')),
      effects: [
        AssessmentEffects.LookupPostcode(Post('postcode')),
      ],
    }),
  ],

  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {
        effects: [
          AssessmentEffects.SaveAnswers(),
          AssessmentEffects.CompleteSection('personal-details'),
        ],
        next: [next({ goto: 'contact-details' })],
      },
      onInvalid: {
        effects: [
          AssessmentEffects.SaveDraft(),
        ],
        // Stay on page
      },
    }),
  ],

  blocks: [
    // ... form fields
  ],
})`,
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
              href: '/forms/form-engine-developer-guide/effects/context',
              labelText: 'The Context Object',
            },
            next: {
              href: '/forms/form-engine-developer-guide/transitions/intro',
              labelText: 'Transitions',
            },
          }),
        ],
      },
    }),
  ],
})
