import { Session } from 'express-session'

export type TieringAssessmentSession = {
  assessmentUuid: string,
  accessMode: string
} & Session
