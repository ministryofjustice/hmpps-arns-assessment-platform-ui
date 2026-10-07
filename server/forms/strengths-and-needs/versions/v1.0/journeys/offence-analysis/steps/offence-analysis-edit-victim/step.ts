import {
  access,
  Condition,
  Params,
  Post,
  redirect,
  step,
  submit,
  Transformer,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { SanAuditEvent, StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Step } from '../../constants/step'
import { victimQuestions } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { victimsCollection } from '../../constants/collections'
import { createRoute } from '../../../../../../generators'
import { baseSanRoute } from '../../../../constants/path'
import { Section } from '../../../../constants/section'
import { auditPageView } from '../../../../audit'
import { autoSaveVictimEditSubmit } from '../../../../autoVictimEdit'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'

export const offenceAnalysisEditVictimStep = step({
  path: `/${Step.offence_analysis_victim_edit.templatePath}`,
  title: 'Add victim',
  view: {
    locals: {
      backlink: createRoute([
        ...baseSanRoute,
        Section.offence_analysis.path,
        Step.offence_analysis_victim_summary.path,
      ]),
    },
  },
  reachability: {
    entryWhen: true,
  },
  blocks: [
    victimQuestions.victimType.displayModes.field,
    victimQuestions.victimAge.displayModes.field,
    victimQuestions.victimSex.displayModes.field,
    victimQuestions.victimEthnicity.displayModes.field,
    saveButton,
  ],
  onAccess: [
    access({
      effects: [
        StrengthsAndNeedsEffects.loadAnswersFromCollection(victimsCollection),
        StrengthsAndNeedsEffects.loadItemFromCollection(
          victimsCollection,
          Params('itemId').pipe(Transformer.String.ToInt()),
        ),
      ],
    }),
    auditPageView(SanAuditEvent.VIEW_SECTION_SUMMARY, Section.offence_analysis, Step.offence_analysis_victim_edit),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.offence_analysis.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autoSaveVictimEditSubmit(
      Step.offence_analysis_victim_summary.code,
      victimsCollection,
      Params('itemId').pipe(Transformer.String.ToInt()),
    ),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.offence_analysis_victim_summary.code, 'FALSE')],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.updateItemFromCollection(
            victimsCollection,
            Params('itemId').pipe(Transformer.String.ToInt()),
          ),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.offence_analysis_summary.code, IsUserSubmitted.false),
        ],
        next: [redirect({ goto: Step.offence_analysis_victim_summary.path })],
      },
    }),
  ],
})
