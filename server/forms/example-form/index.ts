import {
  journey,
  step,
  block,
  field,
  validation,
  loadTransition,
  accessTransition,
  submitTransition,
  next,
  Answer,
  Data,
  Self,
  Post,
  Item,
  Format,
  Collection,
} from '@form-engine/form/builders'
import { when } from '@form-engine/form/builders/ConditionalExprBuilder'
import { and, or, xor, not } from '@form-engine/form/builders/PredicateTestExprBuilder'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { GovUKButton } from '@form-engine/registry/components/govuk-frontend/button/govukButton'
import { GovUKTextInput } from '@form-engine/registry/components/govuk-frontend/text-input/govukTextInput'
import { GovUKRadioInput } from '@form-engine/registry/components/govuk-frontend/radio-input/govukRadioInput'
import { CollectionBlock } from '@form-engine/registry/components/core/collection-block/collectionBlock'
import { HtmlBlock } from '@form-engine/registry/components/core/html/html'

/**
 * Form Example
 * This form demonstrates every expression type and block structure.
 * It's designed to test AST compilation and ensure all features work correctly.
 */

/**
 * Main Journey - Demonstrates all lifecycle hooks and expression types
 */
export default journey({
  code: 'example-form',
  title: 'Example Form Showcase',
  path: '/example-form-showcase',

  /**
   * Lifecycle Hook: onLoad
   * Demonstrates loading effects
   */
  onLoad: [
    loadTransition({
      effects: [],
      // In real app, would load data with effects
    }),
  ],

  /**
   * Lifecycle Hook: onAccess
   * Demonstrates guards using all predicate types
   */
  onAccess: [
    accessTransition({
      // Complex predicate using AND, NOT
      guards: and(
        Data('userRole').match(Condition.Equals('admin')),
        not(Data('suspended').match(Condition.Equals(true))),
      ),
      redirect: [next({ goto: '/unauthorized' })],
    }),
  ],

  steps: [
    /**
     * Step 1: Basic Expression Types
     */
    step({
      path: '/expressions',
      title: 'expressions',
      blocks: [
        // Block Type 1: Regular block
        block({
          variant: 'inset',
        }),

        // Block Type 2: Field block with validations
        field<GovUKTextInput>({
          code: 'username',
          variant: 'govukTextInput',
          label: 'Username',

          formatters: [Transformer.String.Trim(), Transformer.String.ToLowerCase()],

          // ValidationExpr with Self() reference
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Username is required',
            }),
          ],
        }),

        // Field with ConditionalExpr value
        field<GovUKTextInput>({
          code: 'display_value',
          variant: 'govukTextInput',
          label: 'Display Value',

          // ConditionalExpr: when/then/else
          value: when(Answer('username').match(Condition.IsRequired())).then('User exists').else('No user'),
        }),

        // Field showing Answer() reference
        field<GovUKTextInput>({
          code: 'echo',
          variant: 'govukTextInput',
          label: 'Echo Field',
          value: Answer('username'),
        }),

        field<GovUKTextInput>({
          code: 'deep_dependency',
          variant: 'govukTextInput',
          label: 'Deep Dependency Field',
          hint: 'Only shown when echo has content (echo depends on username)',
          dependent: Answer('echo').match(Condition.IsRequired()),
        }),

        // Button showing Post() reference
        block<GovUKButton>({
          variant: 'govukButton',
          name: 'action',
          value: 'continue',
          text: 'Continue',
        }),
      ],

      /**
       * Lifecycle Hook: onSubmission
       */
      onSubmission: [
        submitTransition({
          // Post() reference
          when: Post('action').match(Condition.Equals('continue')),
          validate: true,
          onValid: {
            // NextExpr for navigation
            next: [next({ goto: '/predicates' })],
          },
          onInvalid: {
            next: [next({ goto: '/expressions' })],
          },
        }),
      ],
    }),

    /**
     * Step 2: Predicate Types
     */
    step({
      path: '/predicates',
      title: 'predicates',
      blocks: [
        // Field with OR predicate
        field<GovUKRadioInput>({
          code: 'choice',
          variant: 'govukRadioInput',
          label: 'Make a choice',
          items: [
            { text: 'Option A', value: 'a' },
            { text: 'Option B', value: 'b' },
            { text: 'Option C', value: 'c' },
          ],
        }),

        // Field with complex AND + OR predicate
        field<GovUKTextInput>({
          code: 'conditional_field',
          variant: 'govukTextInput',
          label: 'Conditional Field',

          // Complex predicate combining AND, OR
          validate: [
            validation({
              when: and(
                or(Answer('choice').match(Condition.Equals('a')), Answer('choice').match(Condition.Equals('b'))),
                Self().not.match(Condition.IsRequired()),
              ),
              message: 'Required when A or B selected',
            }),
          ],
        }),

        // Field with XOR predicate
        field<GovUKTextInput>({
          code: 'xor_field',
          variant: 'govukTextInput',
          label: 'XOR Field',

          // XOR: exactly one must be true;
          validate: [
            validation({
              when: and(
                xor(Answer('choice').match(Condition.Equals('a')), Answer('choice').match(Condition.Equals('c'))),
                Self().not.match(Condition.IsRequired()),
              ),
              message: 'Required when exactly one of A or C is selected',
            }),
          ],
        }),

        // Field with dependency using predicate
        field<GovUKTextInput>({
          code: 'dependent_field',
          variant: 'govukTextInput',
          label: 'Dependent Field',

          // Field dependency - shown when choice is not 'c'
          dependent: Answer('choice').not.match(Condition.Equals('c')),
        }),

        block<GovUKButton>({
          variant: 'govukButton',
          name: 'action',
          value: 'continue',
          text: 'Continue',
        }),
      ],

      onSubmission: [
        submitTransition({
          when: Post('action').match(Condition.Equals('continue')),
          validate: false,
          onAlways: {
            next: [next({ goto: '/collections' })],
          },
        }),
      ],
    }),

    /**
     * Step 3: Nested Conditionals, Collections, and Complex Structures
     */
    step({
      path: '/collections',
      title: 'collections',
      blocks: [
        // Field with deeply nested conditional
        field<GovUKTextInput>({
          code: 'nested_value',
          variant: 'govukTextInput',
          label: 'Nested Conditional',

          // Deeply nested ConditionalExpr
          value: when(Data('userRole').match(Condition.Equals('admin')))
            .then(
              when(Answer('choice').match(Condition.Equals('a')))
                .then('Admin with A')
                .else('Admin without A'),
            )
            .else(
              when(Answer('choice').match(Condition.Equals('b')))
                .then('User with B')
                .else('User without B'),
            ),
        }),

        // Collection block demonstration
        block<CollectionBlock>({
          variant: 'collection-block',
          // Collection source - could be from Data or Answer
          collection: Collection({
            collection: Data('items'), // Assuming 'items' is an array in data
            // Template blocks that gets repeated for each item
            template: [
              block<HtmlBlock>({
                variant: 'html',
                content: Format(`<h3>This is item $1</h3>`, Item().index()),
              }),

              field<GovUKTextInput>({
                code: 'item_field',
                variant: 'govukTextInput',
                label: when(Item().value().not.match(Condition.IsRequired())).then('Item: ').else('No item'),
                // Item() references the current item in the collection
                value: Item().value(),
                hint: 'This field is generated for each item in the collection',
              }),
            ],

            // Optional fallback when collection is empty
            fallback: [
              block<HtmlBlock>({
                variant: 'html',
                content: 'No items available in the collection',
              }),
            ],
          }),
        }),

        // Another collection example with multiple fields per item
        block<CollectionBlock>({
          variant: 'collection-block',
          collection: Collection({
            collection: Answer('selected_items'), // Collection from user's answers
            template: [
              block<HtmlBlock>({
                variant: 'html',
                content: when(Item().value().match(Condition.IsRequired())).then('Valid item').else('Invalid item'),
              }),
            ],
          }),
        }),

        // Composite demonstration - Multiple fields grouped together
        field<GovUKTextInput>({
          code: 'composite_field_1',
          variant: 'govukTextInput',
          label: 'Composite Field 1',
        }),

        field<GovUKTextInput>({
          code: 'composite_field_2',
          variant: 'govukTextInput',
          label: 'Composite Field 2',
        }),

        block<GovUKButton>({
          variant: 'govukButton',
          name: 'action',
          value: 'submit',
          text: 'Submit',
        }),
      ],

      onSubmission: [
        submitTransition({
          when: Post('action').match(Condition.Equals('submit')),
          validate: true,
          onValid: {
            // Conditional navigation
            next: [
              next({
                when: Answer('nested_value').match(Condition.Equals('Admin with A')),
                goto: '/admin-complete',
              }),
              next({
                goto: '/complete',
              }),
            ],
          },
          onInvalid: {
            next: [next({ goto: '/collections' })],
          },
        }),
      ],
    }),

    /**
     * Completion steps
     */
    step({
      path: '/complete',
      title: 'complete',
      blocks: [
        block({
          variant: 'panel',
        }),
      ],
    }),

    step({
      path: '/admin-complete',
      title: 'admin-complete',
      blocks: [
        block({
          variant: 'panel',
        }),
      ],
    }),

    step({
      path: '/unauthorized',
      title: 'unauthorized',
      blocks: [
        block({
          variant: 'warning',
        }),
      ],
    }),
  ],
})
