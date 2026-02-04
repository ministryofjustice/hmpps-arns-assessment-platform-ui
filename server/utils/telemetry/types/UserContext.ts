/**
 * User context for span enrichment.
 */
export interface UserContext {
  id?: string
  authSource?: string
  roles?: string[]
}
