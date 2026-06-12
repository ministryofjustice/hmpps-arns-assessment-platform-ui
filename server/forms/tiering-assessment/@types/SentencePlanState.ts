import { User } from '../../../interfaces/user'

export interface SentencePlanState extends Record<string, unknown> {
  user: User & { authSource: string; token: string }
  requestId: string
}
