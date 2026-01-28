import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

// Note: Code examples show `throwError` from '@form-engine/form/builders'

/**
 * Transitions - Access
 *
 * onAccess transitions for data loading, access control, and conditional redirects.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Access Transitions

  \`accessTransition()\` runs during \`onAccess\` to load data, enforce permissions,
  and optionally redirect or return error responses. It is the gateway for both
  data loading and access control. {.lead}

  ---

  ## Interface

  Access transitions have three common shapes:
  **effects-only** (load data and continue),
  **redirect** (navigate away), or
  **error response** (return a specific status page).
  All share \`when\` and \`effects\`, but differ in their \`next\` outcome.

  ### Shared Properties

  <h3 class="govuk-heading-s"><code>when</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>

  Execution condition. When this predicate evaluates to **true**, the transition executes.
  Use a denial condition (e.g., "not authenticated") when you want to block access.
  If omitted, the transition always executes.

  {{slot:whenCode}}

  <h3 class="govuk-heading-s"><code>effects</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>

  Effects to run when the transition executes. Useful for data loading,
  analytics, logging, or cleanup.

  {{slot:effectsCode}}

  ### Variant-Specific Properties

  {{slot:redirectVariant}}

  {{slot:errorVariant}}

  ---

  ## When Semantics

  \`when\` defines **execution conditions** — when the condition is true,
  the transition executes (effects run, then redirect/error if configured):

  - \`when\` evaluates to **true** → execute effects, then redirect/error if configured
  - \`when\` evaluates to **false** → skip to next transition
  - No \`when\` → always executes

  <div class="govuk-inset-text">
    Think of it as: <em>"<strong>When</strong> this condition is true,
    run this transition (and optionally redirect or show an error)."</em>
  </div>

  ---

  ## Execution: Sequential in Order

  Access transitions execute **sequentially**:

  - Transitions run in order
  - If \`when\` is false, skip to the next transition
  - If \`when\` is true (or omitted), effects run
  - If a transition redirects or returns an error, execution stops
  - If no redirects/errors occur, access is granted

  ---

  ## Effects-Only (Data Loading)

  Use an effects-only transition to load data or pre-populate answers
  before rendering the step:

  {{slot:effectsOnlyCode}}

  ---

  ## Basic Access Control

  Redirect unauthenticated users to login:

  {{slot:basicAccessCode}}

  ---

  ## Step-Level Access Control

  Ensure prerequisite steps are complete before allowing access:

  <div class="govuk-warning-text">
    <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
    <strong class="govuk-warning-text__text">
      <span class="govuk-visually-hidden">Warning</span>
      <span class="govuk-tag govuk-tag--red">TODO</span>
      Reachability checks haven't been implemented yet, so this pattern is a good alternative for now.
    </strong>
  </div>

  {{slot:stepAccessCode}}

  ---

  ## Checking Loaded Data

  Access checks can reference data loaded earlier in \`onAccess\`:

  {{slot:loadedDataCode}}

  ---

  ## Error Responses

  Instead of redirecting, you can return an HTTP error page with a specific status code.
  This is useful for 404 Not Found, 403 Forbidden, etc. where you want to show an error
  rather than navigate away:

  {{slot:errorResponseCode}}

  ---

  ## Dynamic Error Messages

  Error messages can include dynamic values using \`Format()\`:

  {{slot:dynamicErrorCode}}

  ---

  ## Redirect vs Error Response

  | Use Redirect | Use Error Response |
  |--------------|-------------------|
  | User needs to complete a prerequisite step | Resource doesn't exist (404) |
  | User needs to log in | User lacks permission (403) |
  | User should go somewhere else | Server-side error (500) |

  ---

  ## Effects for Analytics

  Use \`effects\` for analytics or logging. Effects run when the transition
  executes (before redirect/error):

  {{slot:analyticsCode}}

  ---

  ## Best Practices

  - **Load before checking:** Ensure earlier \`onAccess\` transitions populate
    any data your checks need
  - **Provide redirect OR throwError:** Every accessTransition with an outcome needs
    either a redirect destination or a throwError for HTTP errors
  - **Use error responses for terminal states:** 404 Not Found, 403 Forbidden, etc.
    should show error pages rather than redirect
  - **Keep \`when\` conditions simple:** Complex permission logic should live in
    your effects, not in the form definition
  - **Use middleware for auth:** Basic authentication is often better
    handled by route middleware rather than form access checks

  ---

  {{slot:pagination}}
`),
  slots: {
    whenCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          when: Data('user.isAuthenticated').not.match(Condition.Equals(true))
          // When user is NOT authenticated → deny access
        `,
      }),
    ],
    effectsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          effects: [Analytics.trackAccessDenied('unauthenticated')]
        `,
      }),
    ],
    effectsOnlyCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          onAccess: [
            accessTransition({
              effects: [
                MyEffects.loadUserProfile(),
                MyEffects.loadReferenceData(),
              ],
            }),
          ]
        `,
      }),
    ],
    redirectVariant: [
      GovUKDetails({
        summaryText: 'Redirect Variant — navigate user to another page',
        content: [
          TemplateWrapper({
            template: parseGovUKMarkdown(`
<h3 class="govuk-heading-s"><code>next</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>

Array of \`redirect()\` destinations. The first matching destination is used.
Use this when the user should be sent somewhere else (login, prerequisite step, etc.).

{{slot:code}}
            `),
            slots: {
              code: [
                CodeBlock({
                  language: 'typescript',
                  code: `
                    accessTransition({
                      when: Data('user.isAuthenticated').not.match(Condition.Equals(true)),
                      next: [redirect({ goto: '/login' })],
                    })

                    // Or with conditional destinations
                    accessTransition({
                      when: Data('session.expired').match(Condition.Equals(true)),
                      next: [
                        redirect({
                          when: Data('reason').match(Condition.Equals('timeout')),
                          goto: '/session-expired',
                        }),
                        redirect({ goto: '/login' }),
                      ],
                    })
                  `,
                }),
              ],
            },
          }),
        ],
      }),
    ],
    errorVariant: [
      GovUKDetails({
        summaryText: 'Error Variant — show error page with HTTP status',
        content: [
          TemplateWrapper({
            template: parseGovUKMarkdown(`
<h3 class="govuk-heading-s"><code>next</code> with <code>throwError()</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>

Use \`throwError()\` in the \`next\` array to return an HTTP error page.
Specify the \`status\` code and \`message\` to display.
Common status codes: \`401\` (Unauthorized), \`403\` (Forbidden), \`404\` (Not Found).

{{slot:code}}
            `),
            slots: {
              code: [
                CodeBlock({
                  language: 'typescript',
                  code: `
                    import { accessTransition, throwError } from '@form-engine/form/builders'

                    accessTransition({
                      when: Data('itemNotFound').match(Condition.Equals(true)),
                      next: [throwError({ status: 404, message: 'Menu item not found' })],
                    })

                    // Dynamic message
                    accessTransition({
                      when: Data('itemNotFound').match(Condition.Equals(true)),
                      next: [throwError({
                        status: 404,
                        message: Format('Item %1 was not found', Params('itemId')),
                      })],
                    })
                  `,
                }),
              ],
            },
          }),
        ],
      }),
    ],
    basicAccessCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          journey({
            code: 'protected-journey',
            path: '/protected',

            onAccess: [
              accessTransition({
                effects: [MyEffects.loadCurrentUser()],
                next: [
                  // Denial condition: user is NOT authenticated
                  redirect({
                    when: Data('user.isAuthenticated').not.match(Condition.Equals(true)),
                    goto: '/login',
                  }),
                ],
              }),
            ],

            steps: [/* ... */],
          })
        `,
      }),
    ],
    stepAccessCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Step 2 requires Step 1 to be complete
          step({
            path: '/step-2',
            title: 'Additional Details',

            onAccess: [
              accessTransition({
                // Denial condition: step 1 is NOT complete
                when: Answer('step1Complete').not.match(Condition.Equals(true)),
                // When true, send back to step 1
                next: [redirect({ goto: '/step-1' })],
              }),
            ],

            blocks: [/* ... */],
          })
        `,
      }),
    ],
    loadedDataCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          step({
            path: '/edit/:itemId',
            title: 'Edit Item',

            onAccess: [
              accessTransition({
                effects: [MyEffects.loadItem(Params('itemId'))],
                next: [
                  // Item not found - redirect to list
                  redirect({
                    when: Data('itemNotFound').match(Condition.Equals(true)),
                    goto: '/items',
                  }),
                  // User cannot edit - redirect to list
                  redirect({
                    when: Data('item.canEdit').not.match(Condition.Equals(true)),
                    goto: '/items',
                  }),
                ],
              }),
            ],

            blocks: [/* ... */],
          })
        `,
      }),
    ],
    errorResponseCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { accessTransition, throwError } from '@form-engine/form/builders'

          step({
            path: '/edit/:itemId',
            title: 'Edit Item',

            onAccess: [
              accessTransition({
                effects: [MyEffects.loadItem(Params('itemId'))],
                next: [
                  // 404: Item not found
                  throwError({
                    when: Data('itemNotFound').match(Condition.Equals(true)),
                    status: 404,
                    message: 'Menu item not found',
                  }),
                  // 403: User cannot edit this item
                  throwError({
                    when: Data('item.canEdit').not.match(Condition.Equals(true)),
                    status: 403,
                    message: 'You do not have permission to edit this item',
                  }),
                ],
              }),
            ],

            blocks: [/* ... */],
          })
        `,
      }),
    ],
    dynamicErrorCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { accessTransition, throwError } from '@form-engine/form/builders'

          onAccess: [
            accessTransition({
              when: Data('itemNotFound').match(Condition.Equals(true)),
              next: [throwError({
                status: 404,
                message: Format('Item %1 was not found', Params('itemId')),
              })],
            }),
          ]
        `,
      }),
    ],
    analyticsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          onAccess: [
            accessTransition({
              // Denial: not authenticated
              when: Data('user.isAuthenticated').not.match(Condition.Equals(true)),
              effects: [
                // Log the access denial before redirecting
                Analytics.trackAccessDenied('unauthenticated'),
              ],
              next: [redirect({ goto: '/login' })],
            }),
          ]
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/transitions/intro',
          labelText: 'Introduction',
        },
        next: {
          href: '/form-engine-developer-guide/transitions/action',
          labelText: 'Action Transitions',
        },
      }),
    ],
  },
})
