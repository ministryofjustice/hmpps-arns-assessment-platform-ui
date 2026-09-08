import { ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'
import { Format } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Paths } from '../i18n'

export type ContentForFn<T> = (key: Paths<T>, ...args: any[]) => ResolvableString

export class ContentFormatter<T = any> {
  constructor(private contentForFn?: ContentForFn<T>) {}

  /**
   * Wraps one or more locale keys or expressions in a GOV.UK paragraph tag.
   * Supports multiple arguments to inline-compose content inside the paragraph.
   */
  p(...contents: (Paths<T> | ResolvableString)[]): ResolvableString {
    const resolved = contents.map(item => this.resolve(item))
    return Format(`<p class="govuk-body">${resolved.map((_, i) => `%${i + 1}`).join('')}</p>`, ...resolved)
  }

  /**
   * Wraps content in a bold GOV.UK paragraph tag (<p class="govuk-body govuk-!-font-weight-bold">).
   */
  boldP(content: Paths<T> | ResolvableString): ResolvableString {
    return Format('<p class="govuk-body govuk-!-font-weight-bold">%1</p>', this.resolve(content))
  }

  /**
   * Wraps inline content in a GOV.UK bold span tag (<span class="govuk-!-font-weight-bold">).
   */
  bold(content: Paths<T> | ResolvableString): ResolvableString {
    return Format('<span class="govuk-!-font-weight-bold">%1</span>', this.resolve(content))
  }

  /**
   * Formats locale keys or ResolvableString expressions into a GOV.UK bulleted list.
   */
  bulletList(...items: (Paths<T> | ResolvableString)[]): ResolvableString {
    const resolved = items.map(item => this.resolve(item))
    return Format(
      `<ul class="govuk-list govuk-list--bullet">${resolved.map((_, i) => `<li>%${i + 1}</li>`).join('')}</ul>`,
      ...resolved,
    )
  }

  /**
   * Concatenates multiple formatted ResolvableString blocks together.
   */
  concat(...blocks: ResolvableString[]): ResolvableString {
    return Format(blocks.map((_, i) => `%${i + 1}`).join('\n'), ...blocks)
  }

  /**
   * Wraps inline content in a GOV.UK table tag (<table class="govuk-table">).
   */
  table(...contents: (Paths<T> | ResolvableString)[]): ResolvableString {
    const resolved = contents.map(item => this.resolve(item))
    return Format(`<table class="govuk-table">${resolved.map((_, i) => `%${i + 1}`).join('')}</table>`, ...resolved)
  }

  /**
   * Wraps inline content in a GOV.UK table header tag (<thead class="govuk-table__head">).
   */
  thead(...contents: (Paths<T> | ResolvableString)[]): ResolvableString {
    const resolved = contents.map(item => this.resolve(item))
    return Format(
      `<thead class="govuk-table__head">${resolved.map((_, i) => `%${i + 1}`).join('')}</thead>`,
      ...resolved,
    )
  }

  /**
   * Wraps inline content in a GOV.UK th column tag (<th scope="col" class="govuk-table__header">).
   */
  th(...contents: (Paths<T> | ResolvableString)[]): ResolvableString {
    const resolved = contents.map(item => this.resolve(item))
    return Format(
      `<th scope="col" class="govuk-table__header">${resolved.map((_, i) => `%${i + 1}`).join('')}</th>`,
      ...resolved,
    )
  }

  /**
   * Wraps inline content in a GOV.UK table body tag (<tbody class="govuk-table__body">).
   */
  tbody(...contents: (Paths<T> | ResolvableString)[]): ResolvableString {
    const resolved = contents.map(item => this.resolve(item))
    return Format(
      `<tbody class="govuk-table__body">${resolved.map((_, i) => `%${i + 1}`).join('')}</tbody>`,
      ...resolved,
    )
  }

  /**
   * Wraps inline content in a GOV.UK table row tag (<tr class="govuk-table__row">).
   */
  tr(...contents: (Paths<T> | ResolvableString)[]): ResolvableString {
    const resolved = contents.map(item => this.resolve(item))
    return Format(`<tr class="govuk-table__row">${resolved.map((_, i) => `%${i + 1}`).join('')}</tr>`, ...resolved)
  }

  /**
   * Wraps inline content in a GOV.UK table cell tag (<td class="govuk-table__cell">).
   */
  td(...contents: (Paths<T> | ResolvableString | number)[]): ResolvableString {
    const resolved = contents.map(item => this.resolve(item))
    return Format(`<td class="govuk-table__cell">${resolved.map((_, i) => `%${i + 1}`).join(' ')}</td>`, ...resolved)
  }

  private resolve(item: Paths<T> | ResolvableString | number): ResolvableString {
    if (typeof item === 'string') {
      if (!this.contentForFn) {
        throw new Error('ContentFormatter needs a contentFor function in its constructor to resolve string keys.')
      }
      return this.contentForFn(item as Paths<T>)
    }

    if (typeof item === 'number') {
      return item.toString()
    }

    return item
  }
}
