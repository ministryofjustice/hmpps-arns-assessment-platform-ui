/** Names the form in `details.form` on every SAN audit event. */
export const SAN_AUDIT_FORM = 'strengths-and-needs'

/**
 * Audit events raised by the strengths and needs form.
 */
export enum SanAuditEvent {
  // Views
  VIEW_QUESTION_PAGE = 'VIEW_QUESTION_PAGE',
  VIEW_SECTION_SUMMARY = 'VIEW_SECTION_SUMMARY',
  VIEW_PRACTITIONER_ANALYSIS = 'VIEW_PRACTITIONER_ANALYSIS',
  VIEW_ALL_ANSWERS = 'VIEW_ALL_ANSWERS',
  VIEW_PREVIOUS_VERSIONS = 'VIEW_PREVIOUS_VERSIONS', // TODO: wire up when /strengths-and-needs/v1.0/previous-versions is built
  VIEW_HISTORIC_ASSESSMENT = 'VIEW_HISTORIC_ASSESSMENT', // TODO: wire up when the read-only previous version page is built

  // User actions and edits
  SAVE_QUESTION_PAGE = 'SAVE_QUESTION_PAGE',
  MARK_SECTION_COMPLETE = 'MARK_SECTION_COMPLETE',
  EDIT_ANSWERS = 'EDIT_ANSWERS',
  PRINT_ASSESSMENT = 'PRINT_ASSESSMENT', // TODO: wire up when SAN has a print button of its own - a browser print is not this event
}
