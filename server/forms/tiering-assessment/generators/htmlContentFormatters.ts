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

  private resolve(item: Paths<T> | ResolvableString): ResolvableString {
    if (typeof item === 'string') {
      if (!this.contentForFn) {
        throw new Error('ContentFormatter needs a contentFor function in its constructor to resolve string keys.')
      }
      return this.contentForFn(item as Paths<T>)
    }
    return item
  }
}
