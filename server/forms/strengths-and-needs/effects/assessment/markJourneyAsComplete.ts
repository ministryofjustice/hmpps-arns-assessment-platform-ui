import {StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps} from '../types'

export const markJourneyAsComplete =
  (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
    let session = context.getSession()
    session.assessmentProgress.employmentEducationComplete = true
    const employmentEducationStatus = context.getData('employment_education_section_complete')

    if (employmentEducationStatus !== 'COMPLETE') {
      session.assessmentProgress.employmentEducationComplete = true
    }
  }
