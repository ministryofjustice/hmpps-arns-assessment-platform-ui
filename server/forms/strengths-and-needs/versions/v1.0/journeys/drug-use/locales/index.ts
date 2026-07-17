import { ChainableRef } from '@ministryofjustice/hmpps-forge/core/authoring'
import { AccommodationLocale, english } from './en-gb'
import { contentFrom, Locales } from '../../../../../i18n'

const locales: Locales = {
  'en-gb': english,
}

export const contentFor = contentFrom<AccommodationLocale>(locales)

export const drugValueToText = (value: string | ChainableRef) =>
  contentFor(`option.${value}` as Parameters<typeof contentFor>[0])
