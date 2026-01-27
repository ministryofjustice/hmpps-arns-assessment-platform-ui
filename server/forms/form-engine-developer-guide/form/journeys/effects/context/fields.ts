import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Effects - The Context Object
 *
 * Deep dive into the EffectFunctionContext API and how to use it.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # The Context Object

  Every effect function receives an \`EffectFunctionContext\` object as its
  first parameter. This object provides a clean API for reading and writing form state. {.lead}

  ---

  ## Context Overview

  The context groups its methods into four categories:

  | Category | Purpose | Methods |
  |----------|---------|---------|
  | **Answers** | Form field values | \`getAnswer\`, \`setAnswer\`, \`getAllAnswers\`, \`hasAnswer\`, \`clearAnswer\` |
  | **Data** | Supplementary data (API responses, reference data) | \`getData\`, \`setData\`, \`getAllData\` |
  | **Request** | HTTP request data (params, query, POST body) | \`getRequestParam\`, \`getQueryParam\`, \`getPostData\` |
  | **Session & State** | Persistent session and request-level state | \`getSession\`, \`getState\`, \`getAllState\` |

  ---

  ## Answer Methods

  Answers are form field values — what users enter into fields. Use these methods
  to read, write, and manage answer values.

  ### getAnswer(key)

  Get a single answer value by field code. Returns \`undefined\` if the
  answer doesn't exist.

  {{slot:getAnswerCode}}

  ### setAnswer(key, value)

  Set an answer value. This is used to pre-populate form fields from loaded data.
  The value will appear in the form field when rendered.

  {{slot:setAnswerCode}}

  ### getAllAnswers()

  Get all answers as a flat object. Returns current values only (without mutation history).

  {{slot:getAllAnswersCode}}

  ### hasAnswer(key) and clearAnswer(key)

  Check if an answer exists or remove an answer entirely.

  {{slot:hasAnswerCode}}

  ---

  ## Data Methods

  Data is supplementary information that isn't a form field value — API responses,
  reference data for dropdowns, computed values, and anything else you need to pass
  to the form.

  ### setData(key, value)

  Store data in the context. This data can be accessed in form definitions using
  \`Data('key')\`.

  {{slot:setDataCode}}

  ### getData(key?)

  Retrieve stored data. Pass a key to get a specific value, or call without
  arguments to get all data.

  {{slot:getDataCode}}

  ### Using Data in Forms

  Data set via \`setData()\` is available in form definitions using the
  \`Data()\` reference:

  {{slot:dataInFormsCode}}

  ---

  ## Request Methods

  Access HTTP request data — URL parameters, query strings, and POST body.

  ### getRequestParam(key) and getAllRequestParams()

  Get URL route parameters. For a route like \`/assessment/:id/step/:stepId\`,
  these methods access \`:id\` and \`:stepId\`.

  {{slot:getRequestParamCode}}

  ### getQueryParam(key) and getAllQueryParams()

  Get URL query string parameters. For \`/search?q=test&page=2\`,
  these access the query values.

  {{slot:getQueryParamCode}}

  ### getPostData(key?)

  Get raw POST body data. This is the unprocessed form submission data, before
  formatters are applied.

  {{slot:getPostDataCode}}

  ---

  ## Session and State Methods

  Access persistent session data and request-level state.

  ### getSession()

  Get the session object. The session persists across requests and is tied to
  the user's browser session. **The session object is mutable** —
  changes are automatically saved.

  {{slot:getSessionCode}}

  ### getState(key) and getAllState()

  Get request-level state values. These are set by the application (not form-engine)
  and typically include user information, CSRF tokens, and other request context.

  {{slot:getStateCode}}

  ---

  ## Answer Mutation History

  Form-engine tracks how each answer changes throughout the request lifecycle.
  This enables advanced features like delta calculation (only saving changed answers).

  ### How Mutation History Works

  Each answer has a \`current\` value and a list of \`mutations\`.
  Each mutation records the value and its source:

  | Source | When Set |
  |--------|----------|
  | \`access\` | During \`onAccess\` transitions |
  | \`action\` | During \`onAction\` transitions (e.g., postcode lookup) |
  | \`post\` | Raw value from POST body (user form submission) |
  | \`sanitized\` | After HTML entity sanitization |
  | \`processed\` | After formatters/transformers applied |
  | \`default\` | From field's \`defaultValue\` |
  | \`dependent\` | Value cleared because field's \`dependent\` condition was false |

  ### getAnswerHistory(key) and getAllAnswerHistories()

  Access the full mutation history for answers. This is useful for calculating
  what changed during the current request.

  {{slot:answerHistoryCode}}

  ---

  ## Complete Example

  Here's an effect that uses multiple context methods:

  {{slot:completeExampleCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    getAnswerCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Get a single answer
          const email = context.getAnswer('email')
          // → 'user@example.com' or undefined

          // Type assertion if you know the type
          const age = context.getAnswer('age') as number
        `,
      }),
    ],
    setAnswerCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Pre-populate a text field
          context.setAnswer('firstName', 'John')

          // Pre-populate from loaded data
          const userData = await api.getUser(userId)
          context.setAnswer('firstName', userData.firstName)
          context.setAnswer('lastName', userData.lastName)
          context.setAnswer('email', userData.email)

          // Set array value (for checkboxes with multiple: true)
          context.setAnswer('selectedOptions', ['option1', 'option3'])
        `,
      }),
    ],
    getAllAnswersCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Get all answers for saving
          const allAnswers = context.getAllAnswers()
          // → { firstName: 'John', lastName: 'Smith', email: 'john@example.com' }

          await api.saveAnswers(assessmentId, allAnswers)
        `,
      }),
    ],
    hasAnswerCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Check if user has provided an answer
          if (context.hasAnswer('optionalField')) {
            // Process the optional field
          }

          // Clear an answer (removes it completely)
          context.clearAnswer('temporaryValue')
        `,
      }),
    ],
    setDataCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Store API response
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
          })
        `,
      }),
    ],
    getDataCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Get specific data
          const assessment = context.getData('assessment')
          const countries = context.getData('countries')

          // Get all data
          const allData = context.getData()
          // → { assessment: {...}, countries: [...], ... }

          // Check for data presence
          const user = context.getData('user')
          if (!user) {
            throw new Error('User data not loaded')
          }
        `,
      }),
    ],
    dataInFormsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // In your effect
          context.setData('countries', [
            { value: 'GB', text: 'United Kingdom' },
            { value: 'US', text: 'United States' },
          ])

          // In your form definition
          GovUKRadioInput({
            code: 'country',
            fieldset: { legend: { text: 'Select your country' } },
            items: Data('countries'),  // Uses data from context
          })

          // Access nested data
          HtmlBlock({
            content: Format('<p>Assessment ID: %1</p>', Data('assessment.id')),
          })
        `,
      }),
    ],
    getRequestParamCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Route: /assessment/:assessmentId/item/:itemId

          // Get specific param
          const assessmentId = context.getRequestParam('assessmentId')
          // → '123'

          const itemId = context.getRequestParam('itemId')
          // → 'new' or 'item_456'

          // Get all params
          const allParams = context.getAllRequestParams()
          // → { assessmentId: '123', itemId: 'new' }
        `,
      }),
    ],
    getQueryParamCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // URL: /search?q=test&page=2&tags=a&tags=b

          // Get specific query param
          const query = context.getQueryParam('q')
          // → 'test'

          const page = context.getQueryParam('page')
          // → '2'

          // Multi-value params return arrays
          const tags = context.getQueryParam('tags')
          // → ['a', 'b']

          // Get all query params
          const allQuery = context.getAllQueryParams()
          // → { q: 'test', page: '2', tags: ['a', 'b'] }
        `,
      }),
    ],
    getPostDataCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Get specific POST value
          const action = context.getPostData('action')
          // → 'continue' or 'save' or 'lookup'

          // Useful for action buttons
          if (context.getPostData('action') === 'lookup') {
            const postcode = context.getPostData('postcode')
            await lookupAddress(postcode)
          }

          // Get all POST data
          const allPost = context.getPostData()
          // → { action: 'continue', firstName: 'John', ... }
        `,
      }),
    ],
    getSessionCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Get the session object
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
          }
        `,
      }),
    ],
    getStateCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Get specific state value
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
          })
        `,
      }),
    ],
    answerHistoryCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Get history for a single answer
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
          }
        `,
      }),
    ],
    completeExampleCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          LoadAndPrepareAssessment: deps => async (context) => {
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
          }
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
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
})
