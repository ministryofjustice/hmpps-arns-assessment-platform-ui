import { access, Data, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { commonContentFor, stepTitle } from '../../locales'
import { checkYourAnswersBlock } from './fields'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'
import {
  currentOffenceHeadingQuestion,
  currentOffenceSummaryListQuestion,
} from '../current-offence-and-offending-history/fields'
import { Step } from '../../constants/page'
import { contentFor } from './locales'

/**
 * Every answer given so far across every section.
 */
export const checkYourAnswersStep = step({
  path: `/${Step.check_your_answers.path}`,
  title: stepTitle(Step.check_your_answers),
  reachability: { entryWhen: true },
  onAccess: [
    access({
      effects: [
        TieringAssessmentEffects.LoadAssessmentData(),
        TieringAssessmentEffects.LoadOffenceCodeDetails(),
        TieringAssessmentEffects.LoadCaseData(),
      ],
    }),
  ],
  view: {
    locals: {
      hideNavigation: true,
      hideNavigationLinks: true,
      sectionTitle: commonContentFor('all_answers_heading', CaseData.ForenamePossessive),
      backlink: Data('viewAllAnswersBacklink'),
    },
  },
  blocks: [
    currentOffenceHeadingQuestion,
    currentOffenceSummaryListQuestion,
    ...checkYourAnswersBlock,
    GovUKButton({ text: contentFor('view_reoffending_predictor_scores') }),
  ],
  onSubmission: [
    submit({
      validate: false,
      onAlways: {
        effects: [TieringAssessmentEffects.CalculateRiskActuarialScores()],
        next: [redirect({ goto: Step.reoffending_predictor_scores.path })],
      },
    }),
  ],
})
