import EffectFunctionContext from '@form-engine/core/nodes/expressions/effect/EffectFunctionContext'
import { AccessSession } from '../../access/effects/types'
import AuditService from '../../../services/auditService'

export interface PlatformSession extends AccessSession {
  privacyAccepted?: boolean
}

export interface PlatformState extends Record<string, unknown> {
  user?: {
    id: string
    name: string
    authSource: string
    token: string
  }
  requestId?: string
}

export type PlatformContext = EffectFunctionContext<
  Record<string, unknown>,
  Record<string, unknown>,
  PlatformSession,
  PlatformState
>

export interface PlatformEffectsDeps {
  auditService: AuditService
}
