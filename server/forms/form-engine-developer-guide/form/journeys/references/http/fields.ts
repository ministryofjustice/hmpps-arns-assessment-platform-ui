import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination, GovUKWarningText } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * References - HTTP References (Params, Query, Post, Request, Session)
 *
 * Documentation for references that access request and session context:
 * Params(), Query(), Post(), Request.*(), and Session().
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
# HTTP References

Five reference types access request or session context:
\`Params()\`, \`Query()\`, \`Post()\`, \`Request.*()\`, and \`Session()\`.
These are always available without needing to load data first. {.lead}

---

## Params()

Access URL path parameters (route parameters):

{{slot:paramsSignature}}

Path parameters are defined in your route with a colon prefix:

{{slot:paramsCode}}

### Common Use Cases

{{slot:paramsUseCases}}

---

## Query()

Access URL query string parameters:

{{slot:querySignature}}

Query parameters come after the \`?\` in the URL:

{{slot:queryCode}}

{{slot:queryWarning}}

### Common Use Cases

{{slot:queryUseCases}}

---

## Post()

Access raw form submission data (before any transformations):

{{slot:postSignature}}

\`Post()\` gives you access to the raw HTTP POST body data.
Unlike \`Answer()\`, this is the untransformed input exactly as submitted.

{{slot:postCode}}

### Post() vs Answer()

| Aspect | Post() | Answer() |
|--------|--------|----------|
| Formatters applied? | No | Yes |
| Default value fallback? | No | Yes |
| When available | Only on form submission | Always (may be undefined) |
| Typical use | Action transitions, debugging | Display, validation, logic |

### Common Use Cases

{{slot:postUseCases}}

---

## Request.*

Access request metadata that is not covered by \`Params()\`, \`Query()\`, or \`Post()\`:

{{slot:requestSignature}}

### Available Methods

- \`Request.Url()\` - full request URL
- \`Request.Path()\` - pathname derived from the request URL
- \`Request.Method()\` - HTTP method
- \`Request.Headers('name')\` - exact request header lookup
- \`Request.Cookies('name')\` - exact request cookie lookup
- \`Request.State('user.name')\` - request state using dot notation

{{slot:requestCode}}

### Common Use Cases

{{slot:requestUseCases}}

---

## Session()

Access server-side session data for the current request:

{{slot:sessionSignature}}

\`Session()\` gives you direct access to values stored in the session object.
Use dot notation to read nested properties from a base session key.

{{slot:sessionCode}}

### Common Use Cases

{{slot:sessionUseCases}}

---

## Availability Summary

| Reference | Source | When Available |
|-----------|--------|----------------|
| \`Params()\` | URL path segments | Always (on any route with params) |
| \`Query()\` | URL query string | Always (may be undefined) |
| \`Post()\` | HTTP POST body | Only after form submission |
| \`Request.*()\` | Request metadata | Always (may be undefined for keyed lookups) |
| \`Session()\` | Server-side session | Always (may be undefined) |

---

## Best Practices

- **Prefer Answer() over Post():** In most cases, you want the formatted/cleaned value from \`Answer()\`
- **Use Request for metadata:** Reach for \`Request.*()\` when you need URL, method, headers, cookies, or request state directly in the form.
- **Use Session for persisted context:** Reach for \`Session()\` when the value lives in server-side session state rather than the incoming request transport.
- **Validate Params in effects:** Route params come from user input (URLs can be typed directly). Validate them before using.
- **Handle missing Query params:** Query params are optional. Use \`Condition.IsPresent()\` or provide defaults.
- **Don't trust Post() for security:** Like all user input, POST data should be validated server-side.

{{slot:safeQueryCode}}

---

{{slot:pagination}}
`),
  slots: {
    paramsSignature: [
      CodeBlock({
        language: 'typescript',
        code: `Params(key: string): ReferenceExpr`,
      }),
    ],
    paramsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Route: /applications/:applicationId/edit
          // URL:   /applications/abc123/edit

          Params('applicationId')  // Returns: 'abc123'

          // Route: /users/:userId/orders/:orderId
          // URL:   /users/user_1/orders/order_42

          Params('userId')   // Returns: 'user_1'
          Params('orderId')  // Returns: 'order_42'
        `,
      }),
    ],
    paramsUseCases: [
      CodeBlock({
        language: 'typescript',
        code: `
          // 1. Load data based on route parameter
          loadApplication: deps => async (context: EffectFunctionContext) => {
            const id = context.getParams().applicationId
            const application = await deps.api.getApplication(id)
            context.setData('application', application)
          }

          // 2. Display the ID in a heading
          HtmlBlock({
            content: Format('Application: %1', Params('applicationId')),
          })

          // 3. Include in a redirect URL
          submitTransition({
            redirect: Format('/applications/%1/submitted', Params('applicationId')),
          })
        `,
      }),
    ],
    querySignature: [
      CodeBlock({
        language: 'typescript',
        code: `Query(key: string): ReferenceExpr`,
      }),
    ],
    queryCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // URL: /search?term=widget&category=electronics&page=2

          Query('term')      // Returns: 'widget'
          Query('category')  // Returns: 'electronics'
          Query('page')      // Returns: '2' (always a string!)
        `,
      }),
    ],
    queryWarning: [
      GovUKWarningText({
        html: 'Query parameters are always strings. Use <code>Transformer.String.ToInt()</code> or <code>Transformer.String.ToFloat()</code> if you need a numeric value.',
      }),
    ],
    queryUseCases: [
      CodeBlock({
        language: 'typescript',
        code: `
          // 1. Pre-fill a search field
          GovUKTextInput({
            code: 'searchTerm',
            label: 'Search',
            defaultValue: Query('q'),
          })

          // 2. Track referral source
          loadAnalytics: deps => (context: EffectFunctionContext) => {
            const source = context.getQuery().ref
            if (source) {
              deps.analytics.trackReferral(source)
            }
          }

          // 3. Show different content based on query param
          HtmlBlock({
            hidden: Query('showHelp').not.match(Condition.String.Equals('true')),
            content: '<p class="govuk-body">Help content here...</p>',
          })
        `,
      }),
    ],
    postSignature: [
      CodeBlock({
        language: 'typescript',
        code: `Post(key: string): ReferenceExpr`,
      }),
    ],
    postCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // User submits form with:
          // email = "  TEST@Example.COM  "

          Post('email')    // Returns: "  TEST@Example.COM  " (raw input)
          Answer('email')  // Returns: "test@example.com" (after trim + lowercase formatters)
        `,
      }),
    ],
    postUseCases: [
      CodeBlock({
        language: 'typescript',
        code: `
          // 1. Check raw submission in action transitions
          actionTransition({
            when: Post('action').match(Condition.String.Equals('delete')),
            effects: [MyEffects.deleteRecord()],
            redirect: '/deleted',
          })

          // 2. Debug what was actually submitted
          logSubmission: deps => (context: EffectFunctionContext) => {
            console.log('Raw POST:', context.getPost())
          }

          // 3. Access hidden form fields
          actionTransition({
            when: Post('_method').match(Condition.String.Equals('PUT')),
            effects: [MyEffects.updateRecord()],
          })
        `,
      }),
    ],
    requestSignature: [
      CodeBlock({
        language: 'typescript',
        code: `
          Request.Url(): ReferenceExpr
          Request.Path(): ReferenceExpr
          Request.Method(): ReferenceExpr
          Request.Headers(name: string): ReferenceExpr
          Request.Cookies(name: string): ReferenceExpr
          Request.State(key: string): ReferenceExpr
        `,
      }),
    ],
    requestCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          Request.Url()                 // 'https://example.test/forms/plan?type=current'
          Request.Path()                // '/forms/plan'
          Request.Method()              // 'GET'
          Request.Headers('referer')    // 'https://example.test/dashboard'
          Request.Cookies('session_id') // 'abc123'
          Request.State('user.name')    // 'Alex Smith'
        `,
      }),
    ],
    requestUseCases: [
      CodeBlock({
        language: 'typescript',
        code: `
          // 1. Show the current path in supporting content
          HtmlBlock({
            content: Format('Current path: %1', Request.Path()),
          })

          // 2. Branch on the request method
          HtmlBlock({
            hidden: Request.Method().not.match(Condition.Equals('POST')),
            content: '<p class="govuk-body">Form submitted successfully.</p>',
          })

          // 3. Read request-scoped user data
          HtmlBlock({
            content: Format('Signed in as %1', Request.State('user.name')),
          })
        `,
      }),
    ],
    sessionSignature: [
      CodeBlock({
        language: 'typescript',
        code: `Session(key: string): ReferenceExpr`,
      }),
    ],
    sessionCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          Session('user')              // { name: 'Alex Smith', role: 'manager' }
          Session('user.name')         // 'Alex Smith'
          Session('permissions.edit')  // true
        `,
      }),
    ],
    sessionUseCases: [
      CodeBlock({
        language: 'typescript',
        code: `
          // 1. Show the signed-in user
          HtmlBlock({
            content: Format('Signed in as %1', Session('user.name')),
          })

          // 2. Gate content on permissions stored in session
          HtmlBlock({
            hidden: Session('permissions.canEdit').not.match(Condition.Equals(true)),
            content: '<p class="govuk-body">Editing is enabled for this account.</p>',
          })

          // 3. Reuse session-backed feature flags
          HtmlBlock({
            hidden: Session('features.goalPreview').not.match(Condition.Equals(true)),
            content: '<p class="govuk-body">Goal preview is enabled.</p>',
          })
        `,
      }),
    ],
    safeQueryCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Safely handle optional query param
          GovUKTextInput({
            code: 'searchTerm',
            defaultValue: Conditional({
              when: Query('q').match(Condition.IsPresent()),
              then: Query('q'),
              else: '',
            }),
          })
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/references/item',
          labelText: 'Item Reference',
        },
        next: {
          href: '/form-engine-developer-guide/references/chaining',
          labelText: 'Chaining References',
        },
      }),
    ],
  },
})
