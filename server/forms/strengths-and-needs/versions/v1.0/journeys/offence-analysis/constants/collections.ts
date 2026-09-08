import { Question } from './question'
import { Collection } from '../../../../../constants/collection'

export const victimsCollection: Collection = {
  name: 'OFFENCE_ANALYSIS_VICTIM',
  fields: [
    Question.offence_analysis_victim_relationship,
    Question.offence_analysis_victim_relationship_other_details,
    Question.offence_analysis_victim_age,
    Question.offence_analysis_victim_sex,
    Question.offence_analysis_victim_race,
  ],
}
