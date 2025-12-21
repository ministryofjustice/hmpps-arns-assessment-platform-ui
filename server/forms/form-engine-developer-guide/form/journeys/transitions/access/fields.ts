import { block } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Transitions - Access
 *
 * onAccess transitions for access control and permission checks.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Access Transitions

  \`accessTransition()\` defines denial conditions for accessing
  a journey or step. When guards match, users are either redirected away
  or shown an error page. {.lead}

  ---

  ## Interface

  Access transitions have two variants: **redirect** (navigate away) or
  **error response** (show error page). Both share \`guards\`
  and \`effects\`, but differ in their response properties.

  ### Shared Properties

  <h3 class="govuk-heading-s"><code>guards</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>

  Denial condition. When this predicate evaluates to **true**, access is denied
  and the redirect or error response executes. If omitted, the transition always triggers.

  {{slot:guardsCode}}

  <h3 class="govuk-heading-s"><code>effects</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>

  Effects to run when access is denied (before redirect/error). Useful for analytics,
  logging, or cleanup.

  {{slot:effectsCode}}

  ### Variant-Specific Properties

  {{slot:redirectVariant}}

  {{slot:errorVariant}}

  ---

  ## Guard Semantics

  Guards define **denial conditions** — when the condition is true,
  access is denied and either \`redirect\` or \`status\`/\`message\` triggers:

  - \`guards\` evaluates to **true** → access **denied** → redirect or error response
  - \`guards\` evaluates to **false** → continue (check next transition or grant access)
  - No matching guards → access granted

  <div class="govuk-inset-text">
    Think of it as: <em>"<strong>When</strong> this denial condition is true,
    redirect to this page or show this error."</em> — similar to validation's "when error condition is true, show message".
  </div>

  ---

  ## Execution: First Match Executes

  Access transitions use **first-match** semantics (like onAction/onSubmission):

  - Transitions are checked in order
  - The first transition where guards match (evaluate to true) executes its redirect or error response
  - If no guards match, access is granted

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

  Access guards can reference data loaded in \`onLoad\`:

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

  Use \`effects\` for analytics or logging. Effects run when access is
  **denied** (before redirect):

  {{slot:analyticsCode}}

  ---

  ## Best Practices

  - **Load before checking:** Ensure \`onLoad\` populates
    any data your guards need
  - **Provide redirect OR status/message:** Every accessTransition needs
    either a redirect destination or a status code with message
  - **Use error responses for terminal states:** 404 Not Found, 403 Forbidden, etc.
    should show error pages rather than redirect
  - **Keep guards simple:** Complex permission logic should live in
    your effects, not in the form definition
  - **Use middleware for auth:** Basic authentication is often better
    handled by route middleware rather than form guards

  ---

  {{slot:pagination}}
`),
  slots: {
    guardsCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          guards: Data('user.isAuthenticated').not.match(Condition.Equals(true))
          // When user is NOT authenticated → deny access
        `,
      }),
    ],
    effectsCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          effects: [Analytics.trackAccessDenied('unauthenticated')]
        `,
      }),
    ],
    redirectVariant: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'Redirect Variant — navigate user to another page',
        content: [
          block<TemplateWrapper>({
            variant: 'templateWrapper',
            template: parseGovUKMarkdown(`
<h3 class="govuk-heading-s"><code>redirect</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>

Array of \`next()\` destinations. The first matching destination is used.
Use this when the user should be sent somewhere else (login, prerequisite step, etc.).

{{slot:code}}
            `),
            slots: {
              code: [
                block<CodeBlock>({
                  variant: 'codeBlock',
                  language: 'typescript',
                  code: `
                    accessTransition({
                      guards: Data('user.isAuthenticated').not.match(Condition.Equals(true)),
                      redirect: [next({ goto: '/login' })],
                    })

                    // Or with conditional destinations
                    accessTransition({
                      guards: Data('session.expired').match(Condition.Equals(true)),
                      redirect: [
                        next({
                          when: Data('reason').match(Condition.Equals('timeout')),
                          goto: '/session-expired',
                        }),
                        next({ goto: '/login' }),
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
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'Error Variant — show error page with HTTP status',
        content: [
          block<TemplateWrapper>({
            variant: 'templateWrapper',
            template: parseGovUKMarkdown(`
<h3 class="govuk-heading-s"><code>status</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>

HTTP status code to return. Common values: \`401\` (Unauthorized),
\`403\` (Forbidden), \`404\` (Not Found).

<h3 class="govuk-heading-s"><code>message</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>

Error message to display. Can be a static string or dynamic using \`Format()\`.

{{slot:code}}
            `),
            slots: {
              code: [
                block<CodeBlock>({
                  variant: 'codeBlock',
                  language: 'typescript',
                  code: `
                    accessTransition({
                      guards: Data('itemNotFound').match(Condition.Equals(true)),
                      status: 404,
                      message: 'Menu item not found',
                    })

                    // Dynamic message
                    accessTransition({
                      guards: Data('itemNotFound').match(Condition.Equals(true)),
                      status: 404,
                      message: Format('Item %1 was not found', Params('itemId')),
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
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          journey({
            code: 'protected-journey',
            path: '/protected',

            onLoad: [
              loadTransition({
                effects: [MyEffects.loadCurrentUser()],
              }),
            ],

            onAccess: [
              accessTransition({
                // Denial condition: user is NOT authenticated
                guards: Data('user.isAuthenticated').not.match(Condition.Equals(true)),
                // When true, redirect to login
                redirect: [next({ goto: '/login' })],
              }),
            ],

            steps: [/* ... */],
          })
        `,
      }),
    ],
    stepAccessCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Step 2 requires Step 1 to be complete
          step({
            path: '/step-2',
            title: 'Additional Details',

            onAccess: [
              accessTransition({
                // Denial condition: step 1 is NOT complete
                guards: Answer('step1Complete').not.match(Condition.Equals(true)),
                // When true, send back to step 1
                redirect: [next({ goto: '/step-1' })],
              }),
            ],

            blocks: [/* ... */],
          })
        `,
      }),
    ],
    loadedDataCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          step({
            path: '/edit/:itemId',
            title: 'Edit Item',

            onLoad: [
              loadTransition({
                effects: [MyEffects.loadItem(Params('itemId'))],
              }),
            ],

            onAccess: [
              // Denial: item was not found
              accessTransition({
                guards: Data('itemNotFound').match(Condition.Equals(true)),
                redirect: [next({ goto: '/items' })],
              }),
              // Denial: user cannot edit this item
              accessTransition({
                guards: Data('item.canEdit').not.match(Condition.Equals(true)),
                redirect: [next({ goto: '/items' })],
              }),
            ],

            blocks: [/* ... */],
          })
        `,
      }),
    ],
    errorResponseCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          step({
            path: '/edit/:itemId',
            title: 'Edit Item',

            onLoad: [
              loadTransition({
                effects: [MyEffects.loadItem(Params('itemId'))],
              }),
            ],

            onAccess: [
              // 404: Item not found
              accessTransition({
                guards: Data('itemNotFound').match(Condition.Equals(true)),
                status: 404,
                message: 'Menu item not found',
              }),

              // 403: User cannot edit this item
              accessTransition({
                guards: Data('item.canEdit').not.match(Condition.Equals(true)),
                status: 403,
                message: 'You do not have permission to edit this item',
              }),
            ],

            blocks: [/* ... */],
          })
        `,
      }),
    ],
    dynamicErrorCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          onAccess: [
            accessTransition({
              guards: Data('itemNotFound').match(Condition.Equals(true)),
              status: 404,
              message: Format('Item %1 was not found', Params('itemId')),
            }),
          ]
        `,
      }),
    ],
    analyticsCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          onAccess: [
            accessTransition({
              // Denial: not authenticated
              guards: Data('user.isAuthenticated').not.match(Condition.Equals(true)),
              effects: [
                // Log the access denial before redirecting
                Analytics.trackAccessDenied('unauthenticated'),
              ],
              redirect: [next({ goto: '/login' })],
            }),
          ]
        `,
      }),
    ],
    pagination: [
      block<GovUKPagination>({
        variant: 'govukPagination',
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/transitions/load',
          labelText: 'Load Transitions',
        },
        next: {
          href: '/forms/form-engine-developer-guide/transitions/action',
          labelText: 'Action Transitions',
        },
      }),
    ],
  },
})
