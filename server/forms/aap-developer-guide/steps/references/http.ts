import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination, GovUKWarningText } from '@form-engine-govuk-components/components'

/**
 * References - HTTP References (Params, Query, Post)
 *
 * Documentation for references that access HTTP request data:
 * Params(), Query(), and Post().
 */
export const httpStep = step({
  path: '/http',
  title: 'HTTP References',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">HTTP References</h1>

        <p class="govuk-body-l">
          Three reference types access data from the HTTP request:
          <code>Params()</code>, <code>Query()</code>, and <code>Post()</code>.
          These are always available without needing to load data first.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Params()</h2>
        <p class="govuk-body">
          Access URL path parameters (route parameters):
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `Params(key: string): ReferenceExpr`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <p class="govuk-body">
          Path parameters are defined in your route with a colon prefix:
        </p>
      `,
    }),

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
Params('orderId')  // Returns: 'order_42'`,
    }),

    // Common Params() use cases
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">Common Use Cases</h3>
        {{slot:code}}
      `,
      slots: {
        code: [
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
})`,
          }),
        ],
      },
    }),

    // Query()
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Query()</h2>
        <p class="govuk-body">
          Access URL query string parameters:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `Query(key: string): ReferenceExpr`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <p class="govuk-body">
          Query parameters come after the <code>?</code> in the URL:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// URL: /search?term=widget&category=electronics&page=2

Query('term')      // Returns: 'widget'
Query('category')  // Returns: 'electronics'
Query('page')      // Returns: '2' (always a string!)`,
    }),

    block<GovUKWarningText>({
      variant: 'govukWarningText',
      html: 'Query parameters are always strings. Use <code>Transformer.String.ToInt()</code> or <code>Transformer.String.ToFloat()</code> if you need a numeric value.',
    }),

    // Common Query() use cases
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">Common Use Cases</h3>
        {{slot:code}}
      `,
      slots: {
        code: [
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
})`,
          }),
        ],
      },
    }),

    // Post()
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Post()</h2>
        <p class="govuk-body">
          Access raw form submission data (before any transformations):
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `Post(key: string): ReferenceExpr`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <p class="govuk-body">
          <code>Post()</code> gives you access to the raw HTTP POST body data.
          Unlike <code>Answer()</code>, this is the untransformed input exactly as submitted.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// User submits form with:
// email = "  TEST@Example.COM  "

Post('email')    // Returns: "  TEST@Example.COM  " (raw input)
Answer('email')  // Returns: "test@example.com" (after trim + lowercase formatters)`,
    }),

    // Post() vs Answer()
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">
        <h3 class="govuk-heading-s">Post() vs Answer()</h3>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Aspect</th>
              <th scope="col" class="govuk-table__header">Post()</th>
              <th scope="col" class="govuk-table__header">Answer()</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Formatters applied?</td>
              <td class="govuk-table__cell">No</td>
              <td class="govuk-table__cell">Yes</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Default value fallback?</td>
              <td class="govuk-table__cell">No</td>
              <td class="govuk-table__cell">Yes</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">When available</td>
              <td class="govuk-table__cell">Only on form submission</td>
              <td class="govuk-table__cell">Always (may be undefined)</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Typical use</td>
              <td class="govuk-table__cell">Action transitions, debugging</td>
              <td class="govuk-table__cell">Display, validation, logic</td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    // Common Post() use cases
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">Common Use Cases</h3>
        {{slot:code}}
      `,
      slots: {
        code: [
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
})`,
          }),
        ],
      },
    }),

    // Availability summary
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Availability Summary</h2>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Reference</th>
              <th scope="col" class="govuk-table__header">Source</th>
              <th scope="col" class="govuk-table__header">When Available</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>Params()</code></td>
              <td class="govuk-table__cell">URL path segments</td>
              <td class="govuk-table__cell">Always (on any route with params)</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>Query()</code></td>
              <td class="govuk-table__cell">URL query string</td>
              <td class="govuk-table__cell">Always (may be undefined)</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>Post()</code></td>
              <td class="govuk-table__cell">HTTP POST body</td>
              <td class="govuk-table__cell">Only after form submission</td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    // Best practices
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Best Practices</h2>

        <ul class="govuk-list govuk-list--bullet">
          <li>
            <strong>Prefer Answer() over Post():</strong> In most cases, you want the
            formatted/cleaned value from <code>Answer()</code>
          </li>
          <li>
            <strong>Validate Params in effects:</strong> Route params come from user input
            (URLs can be typed directly). Validate them before using.
          </li>
          <li>
            <strong>Handle missing Query params:</strong> Query params are optional.
            Use <code>Condition.IsPresent()</code> or provide defaults.
          </li>
          <li>
            <strong>Don't trust Post() for security:</strong> Like all user input,
            POST data should be validated server-side.
          </li>
        </ul>
      `,
    }),

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
    }),
  ],
})
