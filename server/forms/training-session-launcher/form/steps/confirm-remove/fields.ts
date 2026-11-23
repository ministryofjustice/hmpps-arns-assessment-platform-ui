import { Condition, Data, Format, Transformer, when } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TemplateWrapper } from '@ministryofjustice/hmpps-forge/core/components'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'

/**
 * Confirmation question, naming the item, with "Yes, remove" and "Cancel" buttons.
 * The item to remove comes from the query string and is checked against the trainer's preferences, never from POST data.
 */
export const confirmRemoveForm = TemplateWrapper({
  template: `
    <span class="govuk-caption-l">Training</span>
    <h1 class="govuk-heading-l">{{question}}</h1>
    {{detail}}
    <form method="post" novalidate>
      <input type="hidden" name="_csrf" value="{{csrfToken}}">
      <div class="govuk-button-group">
        {{slot:buttons}}
      </div>
    </form>
  `,
  values: {
    csrfToken: Data('csrfToken'),
    question: Data('removal.question').pipe(Transformer.String.EscapeHtml()),
    detail: when(Data('removal.detail').match(Condition.IsRequired()))
      .then(Format('<p class="govuk-body">%1</p>', Data('removal.detail').pipe(Transformer.String.EscapeHtml())))
      .else(''),
  },
  slots: {
    buttons: [
      GovUKButton({
        text: 'Yes, remove',
        name: 'action',
        value: 'confirm',
        classes: 'govuk-button--warning',
        preventDoubleClick: true,
      }),
      GovUKButton({
        text: 'Cancel',
        name: 'action',
        value: 'cancel',
        classes: 'govuk-button--secondary',
      }),
    ],
  },
})
