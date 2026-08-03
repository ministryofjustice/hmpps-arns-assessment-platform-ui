/**
 * Synthetic FormConfig fixture for version "1.0", used by the ported
 * section-mapping tests.
 *
 * The Kotlin section tests (SectionMappingTest.kt) fetch a *real* FormConfig
 * over HTTP from a separate, external UI service at test time - that data
 * isn't available in this repo (see typescript/oasys-datamapping/README.md's
 * "no local fixture" note). This fixture instead synthesizes a FormConfig
 * covering every Field the mapping code references, keyed by `fieldLower`,
 * with every Value enum member accepted as a valid option for every field -
 * sufficient to exercise the mapping logic under test without depending on
 * the real, external form config.
 */

import { Field, fieldLower, Value } from '../../codes'
import { FieldType, type FieldConfig, type FormConfig } from '../../formConfig'

const CHECKBOX_FIELDS = new Set<Field>([
  Field.FINANCE_INCOME,
  Field.OFFENCE_ANALYSIS_ELEMENTS,
  Field.OFFENCE_ANALYSIS_MOTIVATIONS,
  Field.EDUCATION_DIFFICULTIES,
  Field.LIVING_WITH,
  Field.PERSONAL_RELATIONSHIPS_COMMUNITY_IMPORTANT_PEOPLE,
  Field.DRUGS_INJECTED,
  Field.DRUGS_INJECTED_HEROIN,
  Field.DRUGS_INJECTED_METHADONE_NOT_PRESCRIBED,
  Field.DRUGS_INJECTED_OTHER_OPIATES,
  Field.DRUGS_INJECTED_CRACK,
  Field.DRUGS_INJECTED_COCAINE,
  Field.DRUGS_INJECTED_MISUSED_PRESCRIBED_DRUGS,
  Field.DRUGS_INJECTED_BENZODIAZEPINES,
  Field.DRUGS_INJECTED_AMPHETAMINES,
  Field.DRUGS_INJECTED_STEROIDS,
  Field.DRUGS_INJECTED_OTHER_DRUG,
])

const COLLECTION_FIELDS = new Set<Field>([Field.OFFENCE_ANALYSIS_VICTIMS_COLLECTION])

const ALL_OPTIONS = Object.values(Value).map(value => ({ value }))

function buildFields(): Record<string, FieldConfig> {
  const fields: Record<string, FieldConfig> = {}
  for (const field of Object.values(Field)) {
    const lower = fieldLower(field)
    fields[lower] = {
      code: lower,
      type: COLLECTION_FIELDS.has(field)
        ? FieldType.COLLECTION
        : CHECKBOX_FIELDS.has(field)
          ? FieldType.CHECKBOX
          : FieldType.RADIO,
      options: ALL_OPTIONS,
    }
  }
  return fields
}

export const formConfig1_0: FormConfig = {
  version: '1.0',
  fields: buildFields(),
}
