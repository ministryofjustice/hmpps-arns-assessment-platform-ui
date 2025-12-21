import { block } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination, GovUKWarningText } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * References - HTTP References (Params, Query, Post)
 *
 * Documentation for references that access HTTP request data:
 * Params(), Query(), and Post().
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
# HTTP References

Three reference types access data from the HTTP request:
\`Params()\`, \`Query()\`, and \`Post()\`.
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

## Availability Summary

| Reference | Source | When Available |
|-----------|--------|----------------|
| \`Params()\` | URL path segments | Always (on any route with params) |
| \`Query()\` | URL query string | Always (may be undefined) |
| \`Post()\` | HTTP POST body | Only after form submission |

---

## Best Practices

- **Prefer Answer() over Post():** In most cases, you want the formatted/cleaned value from \`Answer()\`
- **Validate Params in effects:** Route params come from user input (URLs can be typed directly). Validate them before using.
- **Handle missing Query params:** Query params are optional. Use \`Condition.IsPresent()\` or provide defaults.
- **Don't trust Post() for security:** Like all user input, POST data should be validated server-side.

{{slot:safeQueryCode}}

---

{{slot:pagination}}
`),
  slots: {
    paramsSignature: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `Params(key: string): ReferenceExpr`,
      }),
    ],
    paramsCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
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
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // 1. Load data based on route parameter
          loadApplication: deps => async (context: EffectFunctionContext) => {
            const id = context.getParams().applicationId
            const application = await deps.api.getApplication(id)
            context.setData('application', application)
          }

          // 2. Display the ID in a heading
          block<HtmlBlock>({
            variant: 'html',
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
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `Query(key: string): ReferenceExpr`,
      }),
    ],
    queryCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
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
      block<GovUKWarningText>({
        variant: 'govukWarningText',
        html: 'Query parameters are always strings. Use <code>Transformer.String.ToInt()</code> or <code>Transformer.String.ToFloat()</code> if you need a numeric value.',
      }),
    ],
    queryUseCases: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // 1. Pre-fill a search field
          field<GovUKTextInput>({
            variant: 'govukTextInput',
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
          block<HtmlBlock>({
            variant: 'html',
            hidden: Query('showHelp').not.match(Condition.String.Equals('true')),
            content: '<p class="govuk-body">Help content here...</p>',
          })
        `,
      }),
    ],
    postSignature: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `Post(key: string): ReferenceExpr`,
      }),
    ],
    postCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
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
      block<CodeBlock>({
        variant: 'codeBlock',
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
    safeQueryCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Safely handle optional query param
          field<GovUKTextInput>({
            variant: 'govukTextInput',
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
      block<GovUKPagination>({
        variant: 'govukPagination',
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/references/item',
          labelText: 'Item Reference',
        },
        next: {
          href: '/forms/form-engine-developer-guide/references/chaining',
          labelText: 'Chaining References',
        },
      }),
    ],
  },
})
