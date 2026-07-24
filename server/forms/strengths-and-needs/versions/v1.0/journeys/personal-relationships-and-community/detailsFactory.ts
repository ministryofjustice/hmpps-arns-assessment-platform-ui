import { GovUKCharacterCount } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Condition, PredicateExpr, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'
import { commonContentFor } from '../../locales'

export const detailsFactory = (options: {
  code: string
  label: ResolvableString
  dependentWhen: PredicateExpr
  hint?: ResolvableString
  requiredMessage?: ResolvableString
}) =>
  GovUKCharacterCount({
    code: options.code,
    label: options.label,
    hint: options.hint,
    maxLength: 2000,
    dependentWhen: options.dependentWhen,
    validWhen: [
      ...(options.requiredMessage
        ? [
            validation({
              condition: Self().match(Condition.IsRequired()),
              message: options.requiredMessage,
            }),
          ]
        : []),
      validation({
        condition: Self().match(Condition.String.HasMaxLength(2000)),
        message: commonContentFor('validation.details_character_limit', '2000'),
      }),
    ],
  })
