import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination, GovUKDetails } from '@form-engine-govuk-components/components'

/**
 * Transitions - Access
 *
 * onAccess transitions for access control and permission checks.
 */
export const accessStep = step({
  path: '/access',
  title: 'Access Transitions',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Access Transitions</h1>

        <p class="govuk-body-l">
          <code>accessTransition()</code> defines denial conditions for accessing
          a journey or step. When guards match, users are either redirected away
          or shown an error page.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Interface</h2>
      `,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <p class="govuk-body">
          Access transitions have two variants: <strong>redirect</strong> (navigate away) or
          <strong>error response</strong> (show error page). Both share <code>guards</code>
          and <code>effects</code>, but differ in their response properties.
        </p>

        <h3 class="govuk-heading-s">Shared Properties</h3>
      `,
    }),

    // Property: guards
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>
        <p class="govuk-body">
          Denial condition. When this predicate evaluates to <strong>true</strong>, access is denied
          and the redirect or error response executes. If omitted, the transition always triggers.
        </p>
        {{slot:code}}
      `,
      values: { name: 'guards' },
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `guards: Data('user.isAuthenticated').not.match(Condition.Equals(true))
// When user is NOT authenticated → deny access`,
          }),
        ],
      },
    }),

    // Property: effects
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>
        <p class="govuk-body">
          Effects to run when access is denied (before redirect/error). Useful for analytics,
          logging, or cleanup.
        </p>
        {{slot:code}}
      `,
      values: { name: 'effects' },
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `effects: [Analytics.trackAccessDenied('unauthenticated')]`,
          }),
        ],
      },
    }),

    // Variant-specific properties header
    block<HtmlBlock>({
      variant: 'html',
      content: `<h3 class="govuk-heading-s">Variant-Specific Properties</h3>`,
    }),

    // Redirect Variant
    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'Redirect Variant — navigate user to another page',
      content: [
        block<TemplateWrapper>({
          variant: 'templateWrapper',
          template: `
            <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>
            <p class="govuk-body">
              Array of <code>next()</code> destinations. The first matching destination is used.
              Use this when the user should be sent somewhere else (login, prerequisite step, etc.).
            </p>
            {{slot:code}}
          `,
          values: { name: 'redirect' },
          slots: {
            code: [
              block<CodeBlock>({
                variant: 'codeBlock',
                language: 'typescript',
                code: `accessTransition({
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
})`,
              }),
            ],
          },
        }),
      ],
    }),

    // Error Variant
    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'Error Variant — show error page with HTTP status',
      content: [
        block<TemplateWrapper>({
          variant: 'templateWrapper',
          template: `
            <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>
            <p class="govuk-body">
              HTTP status code to return. Common values: <code>401</code> (Unauthorized),
              <code>403</code> (Forbidden), <code>404</code> (Not Found).
            </p>
          `,
          values: { name: 'status' },
        }),
        block<TemplateWrapper>({
          variant: 'templateWrapper',
          template: `
            <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>
            <p class="govuk-body">
              Error message to display. Can be a static string or dynamic using <code>Format()</code>.
            </p>
            {{slot:code}}
          `,
          values: { name: 'message' },
          slots: {
            code: [
              block<CodeBlock>({
                variant: 'codeBlock',
                language: 'typescript',
                code: `accessTransition({
  guards: Data('itemNotFound').match(Condition.Equals(true)),
  status: 404,
  message: 'Menu item not found',
})

// Dynamic message
accessTransition({
  guards: Data('itemNotFound').match(Condition.Equals(true)),
  status: 404,
  message: Format('Item %1 was not found', Params('itemId')),
})`,
              }),
            ],
          },
        }),
      ],
    }),

    // Guard semantics
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Guard Semantics</h2>

        <p class="govuk-body">
          Guards define <strong>denial conditions</strong> &mdash; when the condition is true,
          access is denied and either <code>redirect</code> or <code>status</code>/<code>message</code> triggers:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li><code>guards</code> evaluates to <strong>true</strong> &rarr; access <strong>denied</strong> &rarr; redirect or error response</li>
          <li><code>guards</code> evaluates to <strong>false</strong> &rarr; continue (check next transition or grant access)</li>
          <li>No matching guards &rarr; access granted</li>
        </ul>

        <div class="govuk-inset-text">
          Think of it as: <em>"<strong>When</strong> this denial condition is true,
          redirect to this page or show this error."</em> &mdash; similar to validation's "when error condition is true, show message".
        </div>
      `,
    }),

    // Execution semantics
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Execution: First Match Executes</h2>

        <p class="govuk-body">
          Access transitions use <strong>first-match</strong> semantics (like onAction/onSubmission):
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li>Transitions are checked in order</li>
          <li>The first transition where guards match (evaluate to true) executes its redirect or error response</li>
          <li>If no guards match, access is granted</li>
        </ul>
      `,
    }),

    // Basic example
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Basic Access Control</h2>
        <p class="govuk-body">
          Redirect unauthenticated users to login:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `journey({
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
})`,
          }),
        ],
      },
    }),

    // Step-level guards
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Step-Level Access Control</h2>
        <p class="govuk-body">
          Ensure prerequisite steps are complete before allowing access:
        </p>
        <div class="govuk-warning-text">
          <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
          <strong class="govuk-warning-text__text">
            <span class="govuk-visually-hidden">Warning</span>
            <span class="govuk-tag govuk-tag--red">TODO</span>
            Reachability checks haven't been implemented yet, so this pattern is a good alternative for now.
          </strong>
        </div>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `// Step 2 requires Step 1 to be complete
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
})`,
          }),
        ],
      },
    }),

    // Checking loaded data
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Checking Loaded Data</h2>
        <p class="govuk-body">
          Access guards can reference data loaded in <code>onLoad</code>:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `step({
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
})`,
          }),
        ],
      },
    }),

    // Error responses
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Error Responses</h2>
        <p class="govuk-body">
          Instead of redirecting, you can return an HTTP error page with a specific status code.
          This is useful for 404 Not Found, 403 Forbidden, etc. where you want to show an error
          rather than navigate away:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `step({
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
})`,
          }),
        ],
      },
    }),

    // Dynamic error messages
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Dynamic Error Messages</h2>
        <p class="govuk-body">
          Error messages can include dynamic values using <code>Format()</code>:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `onAccess: [
  accessTransition({
    guards: Data('itemNotFound').match(Condition.Equals(true)),
    status: 404,
    message: Format('Item %1 was not found', Params('itemId')),
  }),
],`,
          }),
        ],
      },
    }),

    // When to use redirect vs error
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Redirect vs Error Response</h2>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th class="govuk-table__header">Use Redirect</th>
              <th class="govuk-table__header">Use Error Response</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">User needs to complete a prerequisite step</td>
              <td class="govuk-table__cell">Resource doesn't exist (404)</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">User needs to log in</td>
              <td class="govuk-table__cell">User lacks permission (403)</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">User should go somewhere else</td>
              <td class="govuk-table__cell">Server-side error (500)</td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    // Effects for analytics
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Effects for Analytics</h2>
        <p class="govuk-body">
          Use <code>effects</code> for analytics or logging. Effects run when access is
          <strong>denied</strong> (before redirect):
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `onAccess: [
  accessTransition({
    // Denial: not authenticated
    guards: Data('user.isAuthenticated').not.match(Condition.Equals(true)),
    effects: [
      // Log the access denial before redirecting
      Analytics.trackAccessDenied('unauthenticated'),
    ],
    redirect: [next({ goto: '/login' })],
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
            <strong>Load before checking:</strong> Ensure <code>onLoad</code> populates
            any data your guards need
          </li>
          <li>
            <strong>Provide redirect OR status/message:</strong> Every accessTransition needs
            either a redirect destination or a status code with message
          </li>
          <li>
            <strong>Use error responses for terminal states:</strong> 404 Not Found, 403 Forbidden, etc.
            should show error pages rather than redirect
          </li>
          <li>
            <strong>Keep guards simple:</strong> Complex permission logic should live in
            your effects, not in the form definition
          </li>
          <li>
            <strong>Use middleware for auth:</strong> Basic authentication is often better
            handled by route middleware rather than form guards
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
    }),
  ],
})
