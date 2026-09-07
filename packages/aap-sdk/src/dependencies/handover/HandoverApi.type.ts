import type { CreateHandoverLinkRequest } from './HandoverRequest.type'
import type { CreateHandoverLinkResponse, HandoverContext } from './HandoverResponse.type'

export interface HandoverApi {
  createHandoverLink(request: CreateHandoverLinkRequest): Promise<CreateHandoverLinkResponse>
  getCurrentContext(token: string): Promise<HandoverContext>
}
