import { and, Answer, Conditional, Format, not, Self, validation, when } from '@form-engine/form/builders'
import { HtmlBlock, TemplateWrapper } from '@form-engine/registry/components'
import { Condition } from '@form-engine/registry/conditions'
import {
  GovUKDetails,
  GovUKPagination,
  GovUKRadioInput,
  GovUKTextInput,
} from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../../components'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'
import { exampleBox } from '../../../../../helpers/exampleBox'

/**
 * Expressions Playground - Conditional
 *
 * Interactive examples of when() and Conditional() expressions.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Conditional Expressions Playground

  Try these interactive examples to see \`when()\` and
  \`Conditional()\` in action. Make selections to see content
  change dynamically. {.lead}

  ---

  ## Dynamic Field Labels

  Select a country to see the postal code field label and hint change.

  {{slot:example1}}

  {{slot:example1Code}}

  ---

  ## Conditional Content

  Use \`when()\` to show different content based on user selections.
  Select a membership tier to see the benefits.

  {{slot:example2}}

  {{slot:example2Code}}

  ---

  ## Dynamic Status Tags

  Use conditionals inside \`Format()\` to build dynamic status displays.

  {{slot:example3}}

  {{slot:example3Code}}

  ---

  ## Conditional Field Reveal

  Show additional fields based on user selections. The "Other" option
  reveals a text field that becomes required.

  {{slot:example4}}

  {{slot:example4Code}}

  ---

  ## Personalized Content

  Combine user data with conditionals for personalized experiences.

  {{slot:example5}}

  {{slot:example5Code}}

  ---

  {{slot:pagination}}
`),
  slots: {
    example1: [
      exampleBox([
        GovUKRadioInput({
          code: 'playground_cond_country',
          fieldset: {
            legend: { text: 'Where do you live?' },
          },
          items: [
            { value: 'UK', text: 'United Kingdom' },
            { value: 'US', text: 'United States' },
            { value: 'CA', text: 'Canada' },
          ],
        }),

        GovUKTextInput({
          code: 'playground_cond_postcode',
          classes: 'govuk-input--width-10',
          label: Conditional({
            when: Answer('playground_cond_country').match(Condition.Equals('US')),
            then: 'ZIP Code',
            else: Conditional({
              when: Answer('playground_cond_country').match(Condition.Equals('CA')),
              then: 'Postal Code',
              else: 'Postcode',
            }),
          }),
          hint: Conditional({
            when: Answer('playground_cond_country').match(Condition.Equals('US')),
            then: 'For example, 90210 or 90210-1234',
            else: Conditional({
              when: Answer('playground_cond_country').match(Condition.Equals('CA')),
              then: 'For example, K1A 0B1',
              else: 'For example, SW1A 1AA',
            }),
          }),
          hidden: Answer('playground_cond_country').not.match(Condition.IsRequired()),
        }),

        HtmlBlock({
          content: `
            <div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
              <strong>Beverly Hills, that's where I want to be! 🌴</strong>
            </div>
          `,
          hidden: not(
            and(
              Answer('playground_cond_country').match(Condition.Equals('US')),
              Answer('playground_cond_postcode').match(Condition.Equals('90210')),
            ),
          ),
        }),
      ]),
    ],
    example1Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              GovUKTextInput({
                code: 'postcode',
                label: Conditional({
                  when: Answer('country').match(Condition.Equals('US')),
                  then: 'ZIP Code',
                  else: Conditional({
                    when: Answer('country').match(Condition.Equals('CA')),
                    then: 'Postal Code',
                    else: 'Postcode',
                  }),
                }),
                hint: Conditional({
                  when: Answer('country').match(Condition.Equals('US')),
                  then: 'For example, 90210',
                  else: 'For example, SW1A 1AA',
                }),
              })
            `,
          }),
        ],
      }),
    ],
    example2: [
      exampleBox([
        GovUKRadioInput({
          code: 'playground_cond_tier',
          fieldset: {
            legend: { text: 'Select your membership tier' },
          },
          items: [
            { value: 'basic', text: 'Basic (Free)' },
            { value: 'standard', text: 'Standard (£9.99/month)' },
            { value: 'premium', text: 'Premium (£19.99/month)' },
          ],
        }),

        HtmlBlock({
          hidden: Answer('playground_cond_tier').not.match(Condition.IsRequired()),
          content: when(Answer('playground_cond_tier').match(Condition.Equals('premium')))
            .then(
              `<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
                <strong>Premium Benefits:</strong>
                <ul class="govuk-list govuk-list--bullet govuk-!-margin-bottom-0">
                  <li>24/7 priority support</li>
                  <li>Unlimited storage</li>
                  <li>Advanced analytics</li>
                  <li>Custom integrations</li>
                </ul>
              </div>`,
            )
            .else(
              when(Answer('playground_cond_tier').match(Condition.Equals('standard')))
                .then(
                  `<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
                    <strong>Standard Benefits:</strong>
                    <ul class="govuk-list govuk-list--bullet govuk-!-margin-bottom-0">
                      <li>Email support (9am-5pm)</li>
                      <li>10GB storage</li>
                      <li>Basic analytics</li>
                    </ul>
                  </div>`,
                )
                .else(
                  `<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
                    <strong>Basic Benefits:</strong>
                    <ul class="govuk-list govuk-list--bullet govuk-!-margin-bottom-0">
                      <li>Community forum support</li>
                      <li>1GB storage</li>
                    </ul>
                  </div>`,
                ),
            ),
        }),
      ]),
    ],
    example2Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              HtmlBlock({
                content: when(Answer('tier').match(Condition.Equals('premium')))
                  .then('<div class="govuk-inset-text">Premium Benefits...</div>')
                  .else(
                    when(Answer('tier').match(Condition.Equals('standard')))
                      .then('<div class="govuk-inset-text">Standard Benefits...</div>')
                      .else('<div class="govuk-inset-text">Basic Benefits...</div>')
                  ),
              })
            `,
          }),
        ],
      }),
    ],
    example3: [
      exampleBox([
        GovUKRadioInput({
          code: 'playground_cond_status',
          fieldset: {
            legend: { text: 'Application status' },
          },
          items: [
            { value: 'draft', text: 'Draft' },
            { value: 'submitted', text: 'Submitted' },
            { value: 'approved', text: 'Approved' },
            { value: 'rejected', text: 'Rejected' },
          ],
        }),

        HtmlBlock({
          hidden: Answer('playground_cond_status').not.match(Condition.IsRequired()),
          content: Format(
            `<div class="govuk-!-margin-top-4">
              <table class="govuk-table govuk-!-margin-bottom-0">
                <tbody class="govuk-table__body">
                  <tr class="govuk-table__row">
                    <th scope="row" class="govuk-table__header">Status</th>
                    <td class="govuk-table__cell">%1</td>
                  </tr>
                  <tr class="govuk-table__row">
                    <th scope="row" class="govuk-table__header">Next action</th>
                    <td class="govuk-table__cell">%2</td>
                  </tr>
                </tbody>
              </table>
            </div>`,
            Conditional({
              when: Answer('playground_cond_status').match(Condition.Equals('approved')),
              then: '<strong class="govuk-tag govuk-tag--green">Approved</strong>',
              else: Conditional({
                when: Answer('playground_cond_status').match(Condition.Equals('rejected')),
                then: '<strong class="govuk-tag govuk-tag--red">Rejected</strong>',
                else: Conditional({
                  when: Answer('playground_cond_status').match(Condition.Equals('submitted')),
                  then: '<strong class="govuk-tag govuk-tag--blue">Submitted</strong>',
                  else: '<strong class="govuk-tag govuk-tag--grey">Draft</strong>',
                }),
              }),
            }),
            Conditional({
              when: Answer('playground_cond_status').match(Condition.Equals('approved')),
              then: 'No action required',
              else: Conditional({
                when: Answer('playground_cond_status').match(Condition.Equals('rejected')),
                then: 'Review feedback and resubmit',
                else: Conditional({
                  when: Answer('playground_cond_status').match(Condition.Equals('submitted')),
                  then: 'Awaiting review',
                  else: 'Complete and submit your application',
                }),
              }),
            }),
          ),
        }),
      ]),
    ],
    example3Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              Format(
                '<p>Status: %1</p><p>Next: %2</p>',
                Conditional({
                  when: Answer('status').match(Condition.Equals('approved')),
                  then: '<strong class="govuk-tag govuk-tag--green">Approved</strong>',
                  else: Conditional({
                    when: Answer('status').match(Condition.Equals('rejected')),
                    then: '<strong class="govuk-tag govuk-tag--red">Rejected</strong>',
                    else: '<strong class="govuk-tag govuk-tag--grey">Pending</strong>',
                  }),
                }),
                Conditional({
                  when: Answer('status').match(Condition.Equals('approved')),
                  then: 'No action required',
                  else: 'Awaiting review',
                })
              )
            `,
          }),
        ],
      }),
    ],
    example4: [
      exampleBox([
        GovUKRadioInput({
          code: 'playground_cond_contact',
          fieldset: {
            legend: { text: 'How should we contact you?' },
          },
          items: [
            { value: 'email', text: 'Email' },
            { value: 'phone', text: 'Phone' },
            { value: 'post', text: 'Post' },
            {
              value: 'other',
              text: 'Other',
              block: GovUKTextInput({
                code: 'playground_cond_other',
                label: 'Describe your preferred contact method',
                dependent: Answer('playground_cond_contact').match(Condition.Equals('other')),
                validate: [
                  validation({
                    when: Self().not.match(Condition.IsRequired()),
                    message: 'Enter your preferred contact method',
                  }),
                ],
              }),
            },
          ],
        }),

        HtmlBlock({
          hidden: Answer('playground_cond_contact').not.match(Condition.IsRequired()),
          content: Format(
            `<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
              <strong>You selected:</strong> %1
            </div>`,
            when(Answer('playground_cond_contact').match(Condition.Equals('other')))
              .then(Format('Other - %1', Answer('playground_cond_other')))
              .else(Answer('playground_cond_contact')),
          ),
        }),
      ]),
    ],
    example4Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              GovUKRadioInput({
                code: 'contactMethod',
                fieldset: { legend: { text: 'How should we contact you?' } },
                items: [
                  { value: 'email', text: 'Email' },
                  { value: 'phone', text: 'Phone' },
                  {
                    value: 'other',
                    text: 'Other',
                    // Embedded block is revealed when this option is selected
                    block: GovUKTextInput({
                      code: 'otherMethod',
                      label: 'Describe your preferred contact method',
                      // Only validate when parent option is selected
                      dependent: Answer('contactMethod').match(Condition.Equals('other')),
                      validate: [
                        validation({
                          when: Self().not.match(Condition.IsRequired()),
                          message: 'Enter your preferred contact method',
                        }),
                      ],
                    }),
                  },
                ],
              })
            `,
          }),
        ],
      }),
    ],
    example5: [
      exampleBox([
        GovUKTextInput({
          code: 'playground_cond_username',
          label: 'Your name',
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter your name',
            }),
          ],
        }),

        GovUKRadioInput({
          code: 'playground_cond_returning',
          fieldset: {
            legend: { text: 'Have you used this service before?' },
          },
          items: [
            { value: 'yes', text: 'Yes' },
            { value: 'no', text: 'No' },
          ],
          hidden: Answer('playground_cond_username').not.match(Condition.IsRequired()),
        }),

        HtmlBlock({
          hidden: Answer('playground_cond_returning').not.match(Condition.IsRequired()),
          content: Format(
            `<div class="govuk-panel govuk-panel--confirmation govuk-!-margin-top-4 govuk-!-margin-bottom-0">
              <h2 class="govuk-panel__title">%1</h2>
              <div class="govuk-panel__body">%2</div>
            </div>`,
            when(Answer('playground_cond_returning').match(Condition.Equals('yes')))
              .then(Format('Welcome back, %1!', Answer('playground_cond_username')))
              .else(Format('Hello, %1!', Answer('playground_cond_username'))),
            when(Answer('playground_cond_returning').match(Condition.Equals('yes')))
              .then('Your previous data has been loaded.')
              .else("Let's get you set up with a new account."),
          ),
        }),
      ]),
    ],
    example5Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              Format(
                '<h2>%1</h2><p>%2</p>',
                when(Answer('returning').match(Condition.Equals('yes')))
                  .then(Format('Welcome back, %1!', Answer('username')))
                  .else(Format('Hello, %1!', Answer('username'))),
                when(Answer('returning').match(Condition.Equals('yes')))
                  .then('Your previous data has been loaded.')
                  .else('Let\\'s get you set up.')
              )
            `,
          }),
        ],
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/expressions/playground/format',
          labelText: 'Format Playground',
        },
        next: {
          href: '/form-engine-developer-guide/expressions/playground/predicates',
          labelText: 'Predicates Playground',
        },
      }),
    ],
  },
})
