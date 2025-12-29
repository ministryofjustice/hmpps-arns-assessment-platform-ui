import { Format, Item, Literal, Iterator, and, or, when } from '@form-engine/form/builders'
import { TemplateWrapper, CollectionBlock } from '@form-engine/registry/components'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../../components'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

const tableRows = [
  { name: 'Alice Johnson', role: 'Developer', status: 'active' },
  { name: 'Bob Smith', role: 'Designer', status: 'inactive' },
  { name: 'Carol Williams', role: 'Manager', status: 'active' },
  { name: 'David Brown', role: 'Developer', status: 'inactive' },
  { name: 'Eve Davis', role: 'Analyst', status: 'active' },
]

const tasks = [
  { task: 'Review pull request', status: 'completed', priority: 'high' },
  { task: 'Update documentation', status: 'in_progress', priority: 'normal' },
  { task: 'Fix login bug', status: 'pending', priority: 'high' },
  { task: 'Refactor API module', status: 'in_progress', priority: 'high' },
  { task: 'Write unit tests', status: 'pending', priority: 'normal' },
]

/**
 * Iterators Playground - Filter Examples
 *
 * Interactive examples of Iterator.Filter.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Iterator.Filter Examples

  See \`Iterator.Filter\` in action. Each example shows live output
  with the code that generates it. {.lead}

  ---

  ## 1. Filter by Status

  Show only items with \`status: 'active'\`:

  {{slot:example1}}

  {{slot:example1Code}}

  ---

  ## 2. Exclude Items (Negation)

  Show all tasks **except** completed ones using \`.not.match()\`:

  {{slot:example2}}

  {{slot:example2Code}}

  ---

  ## 3. Multiple Conditions with and()

  Show only high priority tasks that are not completed:

  {{slot:example3}}

  {{slot:example3Code}}

  ---

  ## 4. Alternative Conditions with or()

  Show tasks that are either high priority **or** in progress:

  {{slot:example4}}

  {{slot:example4Code}}

  ---

  {{slot:pagination}}
`),
  slots: {
    example1: [
      CollectionBlock({
        classes: 'govuk-!-margin-bottom-4',
        collection: Literal(tableRows)
          .each(Iterator.Filter(Item().path('status').match(Condition.Equals('active'))))
          .each(
            Iterator.Map(
              Format(
                '<p class="govuk-body govuk-!-margin-bottom-2"><strong class="govuk-tag govuk-tag--green govuk-!-margin-right-2">Active</strong> %1 &mdash; %2</p>',
                Item().path('name'),
                Item().path('role'),
              ),
            ),
          ),
      }),
    ],
    example1Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `const tableRows = [
  { name: 'Alice Johnson', role: 'Developer', status: 'active' },
  { name: 'Bob Smith', role: 'Designer', status: 'inactive' },
  { name: 'Carol Williams', role: 'Manager', status: 'active' },
  { name: 'David Brown', role: 'Developer', status: 'inactive' },
  { name: 'Eve Davis', role: 'Analyst', status: 'active' },
]

Literal(tableRows)
  .each(Iterator.Filter(
    Item().path('status').match(Condition.Equals('active'))
  ))
  .each(Iterator.Map(
    Format(
      '<p><strong class="govuk-tag govuk-tag--green">Active</strong> %1 &mdash; %2</p>',
      Item().path('name'),
      Item().path('role')
    )
  ))`,
          }),
        ],
      }),
    ],
    example2: [
      CollectionBlock({
        classes: 'govuk-!-margin-bottom-4',
        collection: Literal(tasks)
          .each(Iterator.Filter(Item().path('status').not.match(Condition.Equals('completed'))))
          .each(
            Iterator.Map(
              Format(
                '<p class="govuk-body govuk-!-margin-bottom-2">%1 %2</p>',
                when(Item().path('status').match(Condition.Equals('in_progress')))
                  .then('<strong class="govuk-tag govuk-tag--blue govuk-!-margin-right-2">In Progress</strong>')
                  .else('<strong class="govuk-tag govuk-tag--grey govuk-!-margin-right-2">Pending</strong>'),
                Item().path('task'),
              ),
            ),
          ),
      }),
    ],
    example2Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `const tasks = [
  { task: 'Review pull request', status: 'completed', priority: 'high' },
  { task: 'Update documentation', status: 'in_progress', priority: 'normal' },
  { task: 'Fix login bug', status: 'pending', priority: 'high' },
  { task: 'Refactor API module', status: 'in_progress', priority: 'high' },
  { task: 'Write unit tests', status: 'pending', priority: 'normal' },
]

Literal(tasks)
  .each(Iterator.Filter(
    Item().path('status').not.match(Condition.Equals('completed'))
  ))
  .each(Iterator.Map(
    Format(
      '<p>%1 %2</p>',
      when(Item().path('status').match(Condition.Equals('in_progress')))
        .then('<strong class="govuk-tag govuk-tag--blue">In Progress</strong>')
        .else('<strong class="govuk-tag govuk-tag--grey">Pending</strong>'),
      Item().path('task')
    )
  ))`,
          }),
        ],
      }),
    ],
    example3: [
      CollectionBlock({
        classes: 'govuk-!-margin-bottom-4',
        collection: Literal(tasks)
          .each(
            Iterator.Filter(
              and(
                Item().path('priority').match(Condition.Equals('high')),
                Item().path('status').not.match(Condition.Equals('completed')),
              ),
            ),
          )
          .each(
            Iterator.Map(
              Format(
                '<p class="govuk-body govuk-!-margin-bottom-2"><strong class="govuk-tag govuk-tag--red govuk-!-margin-right-2">High Priority</strong> %1</p>',
                Item().path('task'),
              ),
            ),
          ),
      }),
    ],
    example3Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `const tasks = [
  { task: 'Review pull request', status: 'completed', priority: 'high' },
  { task: 'Update documentation', status: 'in_progress', priority: 'normal' },
  { task: 'Fix login bug', status: 'pending', priority: 'high' },
  { task: 'Refactor API module', status: 'in_progress', priority: 'high' },
  { task: 'Write unit tests', status: 'pending', priority: 'normal' },
]

Literal(tasks)
  .each(Iterator.Filter(
    and(
      Item().path('priority').match(Condition.Equals('high')),
      Item().path('status').not.match(Condition.Equals('completed'))
    )
  ))
  .each(Iterator.Map(
    Format(
      '<p><strong class="govuk-tag govuk-tag--red">High Priority</strong> %1</p>',
      Item().path('task')
    )
  ))`,
          }),
        ],
      }),
    ],
    example4: [
      CollectionBlock({
        classes: 'govuk-!-margin-bottom-4',
        collection: Literal(tasks)
          .each(
            Iterator.Filter(
              or(
                Item().path('priority').match(Condition.Equals('high')),
                Item().path('status').match(Condition.Equals('in_progress')),
              ),
            ),
          )
          .each(
            Iterator.Map(
              Format(
                '<p class="govuk-body govuk-!-margin-bottom-2">%1 %2 &mdash; %3</p>',
                when(Item().path('priority').match(Condition.Equals('high')))
                  .then('<strong class="govuk-tag govuk-tag--red govuk-!-margin-right-2">High</strong>')
                  .else('<strong class="govuk-tag govuk-tag--grey govuk-!-margin-right-2">Normal</strong>'),
                when(Item().path('status').match(Condition.Equals('in_progress')))
                  .then('<strong class="govuk-tag govuk-tag--blue govuk-!-margin-right-2">In Progress</strong>')
                  .else(''),
                Item().path('task'),
              ),
            ),
          ),
      }),
    ],
    example4Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `Literal(tasks)
  .each(Iterator.Filter(
    or(
      Item().path('priority').match(Condition.Equals('high')),
      Item().path('status').match(Condition.Equals('in_progress'))
    )
  ))
  .each(Iterator.Map(
    Format(
      '<p>%1 %2 &mdash; %3</p>',
      when(Item().path('priority').match(Condition.Equals('high')))
        .then('<strong class="govuk-tag govuk-tag--red">High</strong>')
        .else('<strong class="govuk-tag govuk-tag--grey">Normal</strong>'),
      when(Item().path('status').match(Condition.Equals('in_progress')))
        .then('<strong class="govuk-tag govuk-tag--blue">In Progress</strong>')
        .else(''),
      Item().path('task')
    )
  ))`,
          }),
        ],
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/iterators/playground/map-examples',
          labelText: 'Map Examples',
        },
        next: {
          href: '/forms/form-engine-developer-guide/iterators/playground/find-examples',
          labelText: 'Find Examples',
        },
      }),
    ],
  },
})
