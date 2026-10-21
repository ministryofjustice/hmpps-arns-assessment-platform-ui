import {
  access,
  Condition,
  Post,
  redirect,
  step,
  submit,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { SanAuditEvent, StrengthsAndNeedsEffects } from '../../../../../../effects'
import { victimQuestions } from '../../section'
import { Step } from '../../constants/step'
import { saveButton } from '../../../../constants/buttons'
import { victimsCollection } from '../../constants/collections'
import { createRoute } from '../../../../../../generators'
import { baseSanRoute } from '../../../../constants/path'
import { Section, SectionComplete } from '../../../../constants/section'
import { auditPageView } from '../../../../audit'
import { IsUserSubmitted, isUserSubmittedCondition } from '../../../../constants/userSubmitted'

export const offenceAnalysisVictimStep = step({
  path: `/${Step.offence_analysis_victim.path}`,
  title: 'Add victim',
  view: {
    locals: {
      backlink: createRoute([...baseSanRoute, Section.offence_analysis.path]),
    },
  },
  blocks: [
    victimQuestions.victimType.displayModes.field,
    victimQuestions.victimAge.displayModes.field,
    victimQuestions.victimSex.displayModes.field,
    victimQuestions.victimEthnicity.displayModes.field,
    saveButton,
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.offence_analysis.code),
      message: 'This step is not user submitted',
    }),
  ],
  onAccess: [
    auditPageView(SanAuditEvent.VIEW_SECTION_SUMMARY, Section.offence_analysis, Step.offence_analysis_victim),
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [
          StrengthsAndNeedsEffects.setUserSubmitted(Step.offence_analysis_impact.code, IsUserSubmitted.false),
          StrengthsAndNeedsEffects.setSectionProgress(Section.offence_analysis, SectionComplete.no),
        ],
      },
      onValid: {
        effects: [StrengthsAndNeedsEffects.addItemToCollection(victimsCollection)],
        next: [redirect({ goto: Step.offence_analysis_victim_summary.path })],
      },
    }),
  ],
})
