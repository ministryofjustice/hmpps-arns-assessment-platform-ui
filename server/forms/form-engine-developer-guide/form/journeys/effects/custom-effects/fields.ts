import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Custom Effects
 *
 * How to build, register, and use your own effect functions with dependency injection.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Building Custom Effects

  Custom effects let you define reusable side effect functions that integrate
  seamlessly with the form-engine transition system. {.lead}

  ---

  ## When to Build Custom Effects

  Create custom effects when you need:

  - API integration for loading and saving data
  - External service calls (postcode lookup, email, notifications)
  - Session or state management
  - Analytics tracking and logging
  - Complex data transformation during save
  - Reusable lifecycle operations across multiple forms

  ---

  ## Defining Custom Effects

  Use \`defineEffects()\` for simple effects without external dependencies.
  Each effect receives a \`context\` object and optional arguments.

  {{slot:defineEffectsCode}}

  ---

  ## Effect Function Signature

  Every effect function follows this pattern:

  {{slot:signatureCode}}

  ---

  ## Dependency Injection

  For effects that need external services (API clients, database connections, etc.),
  use \`defineEffectsWithDeps()\`. This separates effect definition from
  dependency wiring.

  {{slot:dependencyInjectionCode}}

  ---

  ## Registering Custom Effects

  After defining your effects, register them with the form engine. The pattern
  differs slightly depending on whether you used \`defineEffects\`
  or \`defineEffectsWithDeps\`.

  {{slot:registrationWithoutDepsCode}}

  {{slot:registrationWithDepsCode}}

  ---

  ## Using Custom Effects in Forms

  Import and use your custom effects in transition definitions. The effect builders
  don't need dependencies — those are wired at registration time.

  {{slot:usageInFormsCode}}

  ---

  ## Organising Custom Effects

  For larger projects, organise effects by domain into separate files,
  then combine them into a single registry.

  {{slot:organisingWithoutDepsCode}}

  When mixing effects that need dependencies with those that don't, export a
  \`createRegistry\` function that accepts the required dependencies:

  {{slot:organisingWithDepsCode}}

  {{slot:organisingUsageCode}}

  ---

  ## Error Handling

  Effects should handle errors appropriately. For critical operations, let errors
  propagate to stop form progression. For non-critical operations, handle gracefully.

  {{slot:errorHandlingCode}}

  ---

  ## Best Practices

  1. **Use dependency injection** — Prefer \`defineEffectsWithDeps\`
     for effects that need external services. This makes testing easier and keeps dependencies explicit.

  2. **Keep effects focused** — Each effect should do one thing well.
     Split complex operations into multiple smaller effects.

  3. **Design for idempotency** — Where possible, make effects safe to
     run multiple times (e.g., check if action already done before repeating).

  4. **Name descriptively** — Use verb prefixes like \`Load*\`,
     \`Save*\`, \`Send*\`, \`Track*\`, \`Initialize*\`
     so the purpose is clear.

  5. **Handle errors appropriately** — Let critical errors propagate,
     handle non-critical errors gracefully. Log useful context for debugging.

  6. **Avoid blocking operations** — If an effect calls a slow API,
     consider whether it's truly needed at that lifecycle point.

  7. **Use clear data namespacing** — When using \`setData()\`,
     use clear keys that won't conflict (e.g., \`'assessment.personal.completed'\`).

  ---

  ## Complete Example

  Here's a complete example of a custom effects set for an assessment form:

  {{slot:completeExampleEffectsCode}}

  {{slot:completeExampleUsageCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    defineEffectsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { defineEffects } from '@form-engine/registry/utils/createRegisterableFunction'
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
          })
        `,
      }),
    ],
    signatureCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Signature
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
          }
        `,
      }),
    ],
    dependencyInjectionCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { defineEffectsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
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
            })
        `,
      }),
    ],
    registrationWithoutDepsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // effects/myEffects.ts
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
            .registerFunctions(MyEffectsRegistry)
        `,
      }),
    ],
    registrationWithDepsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // effects/myEffects.ts
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
            .registerFunctions(myEffectsRegistry)
        `,
      }),
    ],
    usageInFormsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { loadTransition, submitTransition, actionTransition, next, Params, Post } from '@form-engine/form/builders'
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
          })
        `,
      }),
    ],
    organisingWithoutDepsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // effects/index.ts (without dependencies)

          // Import individual effect sets (all using defineEffects)
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
          }
        `,
      }),
    ],
    organisingWithDepsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // effects/index.ts (with dependencies)

          // Some effects use defineEffects (no deps)
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
          export type { ApiEffectsDeps as MyEffectsDeps }
        `,
      }),
    ],
    organisingUsageCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { MyEffects } from './effects'

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
          ],
        `,
      }),
    ],
    errorHandlingCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          export const { effects, createRegistry } = defineEffectsWithDeps<MyDeps>()({
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
          })
        `,
      }),
    ],
    completeExampleEffectsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // effects/assessmentEffects.ts
          import { defineEffectsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
          import EffectFunctionContext from '@form-engine/core/ast/thunks/EffectFunctionContext'
          import type { AssessmentApiClient } from '../services/assessmentApi'
          import type { Logger } from '../services/logger'

          export interface AssessmentEffectsDeps {
            api: AssessmentApiClient
            logger: Logger
          }

          export const { effects: AssessmentEffects, createRegistry: createAssessmentEffectsRegistry } =
            defineEffectsWithDeps<AssessmentEffectsDeps>()({
              LoadAssessment: deps => async (context: EffectFunctionContext, assessmentId: string) => {
                deps.logger.info(\`Loading assessment: \${assessmentId}\`)
                const assessment = await deps.api.getAssessment(assessmentId)
                context.setData('assessment', assessment)

                Object.entries(assessment.answers || {}).forEach(([code, value]) => {
                  context.setAnswer(code, value)
                })
              },

              SaveAnswers: deps => async (context: EffectFunctionContext) => {
                const assessment = context.getData('assessment')
                await deps.api.saveAnswers(assessment.id, context.getAnswers())
                deps.logger.info(\`Answers saved for assessment: \${assessment.id}\`)
              },

              CompleteSection: deps => async (context: EffectFunctionContext, section: string) => {
                const assessment = context.getData('assessment')
                await deps.api.completeSection(assessment.id, section)
                context.setData(\`sections.\${section}.completed\`, true)
                deps.logger.info(\`Section completed: \${section}\`)
              },

              LookupPostcode: deps => async (context: EffectFunctionContext, postcode: string) => {
                if (!postcode?.trim()) return

                try {
                  const address = await deps.api.lookupPostcode(postcode)
                  if (address) {
                    context.setAnswer('addressLine1', address.line1)
                    context.setAnswer('town', address.town)
                    context.setAnswer('county', address.county)
                  } else {
                    context.setData('postcodeError', 'Address not found')
                  }
                } catch (error) {
                  deps.logger.warn(\`Postcode lookup failed: \${(error as Error).message}\`)
                  context.setData('postcodeError', 'Lookup service unavailable')
                }
              },
            })
        `,
      }),
    ],
    completeExampleUsageCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Usage in a form step
          import { step, loadTransition, submitTransition, actionTransition, next, Params, Post } from '@form-engine/form/builders'
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
              }),
            ],

            blocks: [/* ... */],
          })
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
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
})
