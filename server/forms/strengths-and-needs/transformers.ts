import { defineTransformerFunctions } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffectsDeps } from './effects/types'
import { Language, Locales } from './i18n'

const DEFAULT_LANGUAGE = 'en-gb'

export const {
  transformers: StrengthsAndNeedsTransformers,
  implementations: strengthsAndNeedsTransformerImplementations,
} = defineTransformerFunctions<
  {
    ContentFor: (language: string, locales: Locales, path: string, ...replacements: string[]) => string
  },
  StrengthsAndNeedsEffectsDeps
>({
  ContentFor:
    () =>
    (language: string, locales: Locales, path: string, ...replacements: string[]): string => {
      const lang = (language?.split(',')[0]?.toLowerCase() ?? DEFAULT_LANGUAGE) as unknown as Language

      const pathParts = path.split('.')

      const raw = pathParts.reduce((acc, segment) => acc?.[segment], locales[lang] ?? locales['en-gb'])

      if (typeof raw !== 'string') {
        return 'NO_TRANSLATION'
      }

      return replacements.reduce((acc, value, index) => acc.replace(`%${index + 1}`, value), raw)
    },
})
