import {step} from '@ministryofjustice/hmpps-forge/core/authoring'
import {employmentStatusAnalysisSummaryTab} from './fields'
import { Step } from '../../constants/step';
import { locale } from '../../constants/locale';

export const employmentEducationAnalysisStep = step({
  path: '/' + Step.employment_education_analysis.path,
  title: locale.step[Step.employment_education_analysis.code],
  blocks: [employmentStatusAnalysisSummaryTab],
})
