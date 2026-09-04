import { access } from '@ministryofjustice/hmpps-forge/core/authoring'
import { SanAuditEvent } from '../../auditEvents'
import { StrengthsAndNeedsEffects } from '../../effects'
import { Section } from './constants/section'

export { SanAuditEvent } from '../../auditEvents'

type SectionConfig = (typeof Section)[keyof typeof Section]

interface StepConfig {
  code: string
  path: string
}

/** Which page an event happened on  */
const pageDetails = (section: SectionConfig, step: StepConfig) => ({ section: section.code, page: step.code })

/** For a step's `onAccess`. */
export const auditPageView = (event: SanAuditEvent, section: SectionConfig, step: StepConfig) =>
  access({ effects: [StrengthsAndNeedsEffects.sendAuditEvent(event, pageDetails(section, step))] })

/** For a step's `onValid.effects`, after the save effect. */
export const auditPageAction = (event: SanAuditEvent, section: SectionConfig, step: StepConfig) =>
  StrengthsAndNeedsEffects.sendAuditEvent(event, pageDetails(section, step))
