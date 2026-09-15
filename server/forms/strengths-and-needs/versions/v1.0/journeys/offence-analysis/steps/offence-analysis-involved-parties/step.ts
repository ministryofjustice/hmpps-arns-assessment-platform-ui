import { Answer, Condition, Post, redirect, step, submit, when } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { offenceAnalysisSection } from '../../section'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { createRoute } from '../../../../../../generators'
import { baseSanRoute } from '../../../../constants/path'

export const offenceAnalysisInvolvedPartiesStep = step({
  path: `/${Step.offence_analysis_involved_parties.path}`,
  title: 'Offence analysis Involved Parties',
  view: {
    locals: {
      backlink: when(
        Answer(Question.offence_analysis_who_was_the_victim)
          .match(Condition.Array.Contains(Option.one_or_more_person)),
      )
        .then(createRoute([...baseSanRoute, Section.offence_analysis.path, Step.offence_analysis_victim_summary.path]))
        .else(createRoute([...baseSanRoute, Section.offence_analysis.path])),
    },
  },
  blocks: [
    offenceAnalysisSection.questions.offenceAnalysisWhoWasTheOffenceCommittedAgainst.displayModes.field,
    saveButton,
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.offence_analysis, SectionComplete.no),
        ],
        next: [
          redirect({
            goto: Step.offence_analysis_impact.path,
          }),
        ],
      },
    }),
  ],
})
