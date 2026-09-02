import { Locale } from '../../../../../i18n'

export const english = {
  lead_paragraph: "Check versions of %1's current assessment. The links will open in a new tab.",
  previous_versions_table_head_date: 'Date',
  previous_versions_table_head_assessment: 'Assessment',
} as const

export type PreviousVersionLocale = Locale<typeof english>
