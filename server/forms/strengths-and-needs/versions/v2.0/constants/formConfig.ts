import { FormConfig } from '../../../constants/formConfig'
import { QuestionFormat } from '../../../constants/questionContent'
import { v1FormConfig } from '../../v1.0/constants/formConfig'

const formVersion = 'v2.0'

/**
 * PoC: v2.0 reuses every v1.0 screen and adds the one question the v1.0-to-v2.0
 * migration asks, so the migration has a real version to land on.
 */
export const v2FormConfig: Record<string, FormConfig> = {
  [formVersion]: {
    version: formVersion,
    fields: {
      ...v1FormConfig['v1.0'].fields,
      poc_migration_note: { code: 'poc_migration_note', type: QuestionFormat.TEXT },
    },
  },
}
