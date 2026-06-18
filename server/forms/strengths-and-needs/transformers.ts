import { defineTransformerFunctions } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffectsDeps } from './effects/types'
import { Content, ContentPath } from './@types/i18n'

const DEFAULT_LANGUAGE = 'en-gb'

export const {
  transformers: StrengthsAndNeedsTransformers,
  implementations: strengthsAndNeedsTransformerImplementations,
} = defineTransformerFunctions<
  {
    ContentFor: (language: string, content: Content, path: ContentPath, ...replacements: string[]) => string
  },
  StrengthsAndNeedsEffectsDeps
>({
  ContentFor:
    () =>
    (language: string, content: Content, path: ContentPath, ...replacements: string[]): string => {
      const lang = language?.split(',')[0]?.toLowerCase() ?? DEFAULT_LANGUAGE

      const pathParts = Array.isArray(path) ? path : path.split('.')

      const raw = pathParts.reduce<any>((acc, segment) => acc?.[segment], content[lang] ?? content['en-gb'])

      if (typeof raw !== 'string') {
        return 'NO_TRANSLATION'
      }

      return replacements.reduce((acc, value, index) => acc.replace(`%${index + 1}`, value), raw)
    },
})
