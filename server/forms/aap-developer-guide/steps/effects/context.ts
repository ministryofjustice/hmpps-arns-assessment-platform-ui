import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Effects - The Context Object
 *
 * Deep dive into the EffectFunctionContext API and how to use it.
 */
export const contextStep = step({
  path: '/context',
  title: 'The Context Object',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">The Context Object</h1>

        <p class="govuk-body-l">
          Every effect function receives an <code>EffectFunctionContext</code> object as its
          first parameter. This object provides a clean API for reading and writing form state.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Context Overview</h2>

        <p class="govuk-body">
          The context groups its methods into four categories:
        </p>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Category</th>
              <th scope="col" class="govuk-table__header">Purpose</th>
              <th scope="col" class="govuk-table__header">Methods</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><strong>Answers</strong></td>
              <td class="govuk-table__cell">Form field values</td>
              <td class="govuk-table__cell"><code>getAnswer</code>, <code>setAnswer</code>, <code>getAnswers</code>, <code>hasAnswer</code>, <code>clearAnswer</code></td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><strong>Data</strong></td>
              <td class="govuk-table__cell">Supplementary data (API responses, reference data)</td>
              <td class="govuk-table__cell"><code>getData</code>, <code>setData</code>, <code>getAllData</code></td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><strong>Request</strong></td>
              <td class="govuk-table__cell">HTTP request data (params, query, POST body)</td>
              <td class="govuk-table__cell"><code>getRequestParam</code>, <code>getQueryParam</code>, <code>getPostData</code></td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><strong>Session &amp; State</strong></td>
              <td class="govuk-table__cell">Persistent session and request-level state</td>
              <td class="govuk-table__cell"><code>getSession</code>, <code>getState</code>, <code>getAllState</code></td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    // ANSWERS SECTION
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Answer Methods</h2>

        <p class="govuk-body">
          Answers are form field values &mdash; what users enter into fields. Use these methods
          to read, write, and manage answer values.
        </p>

        <h3 class="govuk-heading-s">getAnswer(key)</h3>
        <p class="govuk-body">
          Get a single answer value by field code. Returns <code>undefined</code> if the
          answer doesn't exist.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Get a single answer
const email = context.getAnswer('email')
// → 'user@example.com' or undefined

// Type assertion if you know the type
const age = context.getAnswer('age') as number`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h3 class="govuk-heading-s">setAnswer(key, value)</h3>
        <p class="govuk-body">
          Set an answer value. This is used to pre-populate form fields from loaded data.
          The value will appear in the form field when rendered.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Pre-populate a text field
context.setAnswer('firstName', 'John')

// Pre-populate from loaded data
const userData = await api.getUser(userId)
context.setAnswer('firstName', userData.firstName)
context.setAnswer('lastName', userData.lastName)
context.setAnswer('email', userData.email)

// Set array value (for checkboxes with multiple: true)
context.setAnswer('selectedOptions', ['option1', 'option3'])`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h3 class="govuk-heading-s">getAnswers()</h3>
        <p class="govuk-body">
          Get all answers as a flat object. Returns current values only (without mutation history).
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Get all answers for saving
const allAnswers = context.getAnswers()
// → { firstName: 'John', lastName: 'Smith', email: 'john@example.com' }

await api.saveAnswers(assessmentId, allAnswers)`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h3 class="govuk-heading-s">hasAnswer(key) and clearAnswer(key)</h3>
        <p class="govuk-body">
          Check if an answer exists or remove an answer entirely.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Check if user has provided an answer
if (context.hasAnswer('optionalField')) {
  // Process the optional field
}

// Clear an answer (removes it completely)
context.clearAnswer('temporaryValue')`,
    }),

    // DATA SECTION
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Data Methods</h2>

        <p class="govuk-body">
          Data is supplementary information that isn't a form field value &mdash; API responses,
          reference data for dropdowns, computed values, and anything else you need to pass
          to the form.
        </p>

        <h3 class="govuk-heading-s">setData(key, value)</h3>
        <p class="govuk-body">
          Store data in the context. This data can be accessed in form definitions using
          <code>Data('key')</code>.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Store API response
const assessment = await api.getAssessment(id)
context.setData('assessment', assessment)

// Store reference data for dropdowns
const countries = await api.getCountries()
context.setData('countries', countries)

// Store computed values
context.setData('totalItems', items.length)

// Store nested data
context.setData('user', {
  name: 'John Smith',
  permissions: ['read', 'write'],
})`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h3 class="govuk-heading-s">getData(key?)</h3>
        <p class="govuk-body">
          Retrieve stored data. Pass a key to get a specific value, or call without
          arguments to get all data.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Get specific data
const assessment = context.getData('assessment')
const countries = context.getData('countries')

// Get all data
const allData = context.getData()
// → { assessment: {...}, countries: [...], ... }

// Check for data presence
const user = context.getData('user')
if (!user) {
  throw new Error('User data not loaded')
}`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h3 class="govuk-heading-s">Using Data in Forms</h3>
        <p class="govuk-body">
          Data set via <code>setData()</code> is available in form definitions using the
          <code>Data()</code> reference:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// In your effect
context.setData('countries', [
  { value: 'GB', text: 'United Kingdom' },
  { value: 'US', text: 'United States' },
])

// In your form definition
field<GovUKRadioInput>({
  variant: 'govukRadioInput',
  code: 'country',
  fieldset: { legend: { text: 'Select your country' } },
  items: Data('countries'),  // Uses data from context
})

// Access nested data
block<HtmlBlock>({
  variant: 'html',
  content: Format('<p>Assessment ID: %1</p>', Data('assessment.id')),
})`,
    }),

    // REQUEST SECTION
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Request Methods</h2>

        <p class="govuk-body">
          Access HTTP request data &mdash; URL parameters, query strings, and POST body.
        </p>

        <h3 class="govuk-heading-s">getRequestParam(key) and getRequestParams()</h3>
        <p class="govuk-body">
          Get URL route parameters. For a route like <code>/assessment/:id/step/:stepId</code>,
          these methods access <code>:id</code> and <code>:stepId</code>.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Route: /assessment/:assessmentId/item/:itemId

// Get specific param
const assessmentId = context.getRequestParam('assessmentId')
// → '123'

const itemId = context.getRequestParam('itemId')
// → 'new' or 'item_456'

// Get all params
const allParams = context.getRequestParams()
// → { assessmentId: '123', itemId: 'new' }`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h3 class="govuk-heading-s">getQueryParam(key) and getQueryParams()</h3>
        <p class="govuk-body">
          Get URL query string parameters. For <code>/search?q=test&page=2</code>,
          these access the query values.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// URL: /search?q=test&page=2&tags=a&tags=b

// Get specific query param
const query = context.getQueryParam('q')
// → 'test'

const page = context.getQueryParam('page')
// → '2'

// Multi-value params return arrays
const tags = context.getQueryParam('tags')
// → ['a', 'b']

// Get all query params
const allQuery = context.getQueryParams()
// → { q: 'test', page: '2', tags: ['a', 'b'] }`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h3 class="govuk-heading-s">getPostData(key?)</h3>
        <p class="govuk-body">
          Get raw POST body data. This is the unprocessed form submission data, before
          formatters are applied.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Get specific POST value
const action = context.getPostData('action')
// → 'continue' or 'save' or 'lookup'

// Useful for action buttons
if (context.getPostData('action') === 'lookup') {
  const postcode = context.getPostData('postcode')
  await lookupAddress(postcode)
}

// Get all POST data
const allPost = context.getPostData()
// → { action: 'continue', firstName: 'John', ... }`,
    }),

    // SESSION AND STATE SECTION
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Session and State Methods</h2>

        <p class="govuk-body">
          Access persistent session data and request-level state.
        </p>

        <h3 class="govuk-heading-s">getSession()</h3>
        <p class="govuk-body">
          Get the session object. The session persists across requests and is tied to
          the user's browser session. <strong>The session object is mutable</strong> &mdash;
          changes are automatically saved.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Get the session object
const session = context.getSession()

// Read session values
const assessmentId = session.assessmentId
const startedAt = session.startedAt

// Write to session (mutable - changes persist)
session.assessmentId = '123'
session.stepsCompleted = session.stepsCompleted || []
session.stepsCompleted.push('personal-details')
session.lastVisited = new Date().toISOString()

// Common pattern: initialize session if needed
if (!session.initialized) {
  session.initialized = true
  session.startedAt = new Date().toISOString()
  session.progress = {}
}`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h3 class="govuk-heading-s">getState(key) and getAllState()</h3>
        <p class="govuk-body">
          Get request-level state values. These are set by the application (not form-engine)
          and typically include user information, CSRF tokens, and other request context.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Get specific state value
const user = context.getState('user')
// → { id: '123', name: 'John', roles: ['admin'] }

const csrfToken = context.getState('csrfToken')
// → 'abc123...'

// Get all state
const allState = context.getAllState()
// → { user: {...}, csrfToken: '...', ... }

// Common use: user context for API calls
const user = context.getState('user')
await api.saveAnswers({
  assessmentId,
  answers,
  user,  // Include user context for audit
})`,
    }),

    // ANSWER HISTORY SECTION
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Answer Mutation History</h2>

        <p class="govuk-body">
          Form-engine tracks how each answer changes throughout the request lifecycle.
          This enables advanced features like delta calculation (only saving changed answers).
        </p>

        <h3 class="govuk-heading-s">How Mutation History Works</h3>
        <p class="govuk-body">
          Each answer has a <code>current</code> value and a list of <code>mutations</code>.
          Each mutation records the value and its source:
        </p>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Source</th>
              <th scope="col" class="govuk-table__header">When Set</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>load</code></td>
              <td class="govuk-table__cell">During <code>onLoad</code> transitions</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>action</code></td>
              <td class="govuk-table__cell">During <code>onAction</code> transitions (e.g., postcode lookup)</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>post</code></td>
              <td class="govuk-table__cell">Raw value from POST body (user form submission)</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>sanitized</code></td>
              <td class="govuk-table__cell">After HTML entity sanitization</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>processed</code></td>
              <td class="govuk-table__cell">After formatters/transformers applied</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>default</code></td>
              <td class="govuk-table__cell">From field's <code>defaultValue</code></td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>dependent</code></td>
              <td class="govuk-table__cell">Value cleared because field's <code>dependent</code> condition was false</td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h3 class="govuk-heading-s">getAnswerHistory(key) and getAllAnswerHistories()</h3>
        <p class="govuk-body">
          Access the full mutation history for answers. This is useful for calculating
          what changed during the current request.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Get history for a single answer
const history = context.getAnswerHistory('firstName')
// → {
//   current: 'John',
//   mutations: [
//     { value: 'Johnny', source: 'load' },      // Loaded from API
//     { value: 'John', source: 'post' },        // User changed it
//     { value: 'John', source: 'processed' },   // After formatters
//   ]
// }

// Get all histories
const allHistories = context.getAllAnswerHistories()

// Calculate delta: find answers modified by user
function calculateDelta(histories: Record<string, AnswerHistory>) {
  const userSources = ['post', 'processed', 'action']
  const changed: Record<string, unknown> = {}

  Object.entries(histories).forEach(([code, history]) => {
    const hasUserInput = history.mutations.some(m => userSources.includes(m.source))
    if (hasUserInput) {
      changed[code] = history.current
    }
  })

  return changed
}

// Only save answers the user actually changed
const delta = calculateDelta(context.getAllAnswerHistories())
if (Object.keys(delta).length > 0) {
  await api.saveAnswers(assessmentId, delta)
}`,
    }),

    // COMPLETE EXAMPLE
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Complete Example</h2>
        <p class="govuk-body">
          Here's an effect that uses multiple context methods:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `LoadAndPrepareAssessment: deps => async (context) => {
  // Get route parameter
  const assessmentId = context.getRequestParam('assessmentId')
  if (!assessmentId) {
    throw new Error('Assessment ID required')
  }

  // Get user from request state (for API authorization)
  const user = context.getState('user')

  // Check session for cached data
  const session = context.getSession()
  let assessment

  if (session.cachedAssessmentId === assessmentId) {
    // Use cached assessment
    assessment = session.cachedAssessment
  } else {
    // Load from API
    assessment = await deps.api.getAssessment(assessmentId, user)
    // Cache in session
    session.cachedAssessmentId = assessmentId
    session.cachedAssessment = assessment
  }

  // Store assessment data (for use in form via Data())
  context.setData('assessment', assessment)
  context.setData('isComplete', assessment.status === 'complete')

  // Pre-populate form fields from saved answers
  Object.entries(assessment.answers || {}).forEach(([code, value]) => {
    context.setAnswer(code, value)
  })

  // Track in session
  session.lastAccessedAssessment = assessmentId
  session.lastAccessedAt = new Date().toISOString()
}`,
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
              href: '/forms/form-engine-developer-guide/effects/intro',
              labelText: 'Introduction',
            },
            next: {
              href: '/forms/form-engine-developer-guide/effects/custom',
              labelText: 'Custom Effects',
            },
          }),
        ],
      },
    }),
  ],
})
