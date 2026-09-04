import { Locale } from '../../../../../i18n'

export const english = {
  countersigned_versions_table_caption: 'Countersigned versions',
  lead_paragraph: "Check versions of %1's current assessment. The links will open in a new tab.",
  previous_versions_table_action_view: 'View',
  previous_versions_table_action_view_assessment_visually_hidden: 'assessment from',
  previous_versions_table_action_view_plan_visually_hidden: 'sentence plan from',
  previous_versions_table_caption: 'All versions',
  previous_versions_table_head_assessment: 'Assessment',
  previous_versions_table_head_date: 'Date',
  previous_versions_table_head_plan: 'Plan',
  previous_versions_table_head_status: 'Status',
} as const

export type PreviousVersionLocale = Locale<typeof english>
