import { ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'

interface QueryParam {
  name: string
  value: string
}

/**
 * Creates a URL path from segments, handling nested slashes and query parameters.
 *
 * This generator accepts path segments as resolvable values (e.g., `Params('mode')`),
 * flattens nested slashes in each segment, URI-encodes the components, and optionally
 * appends query parameters.
 *
 * @example
 * // Basic usage with static and dynamic segments
 * SANGenerators.createRoute(['strengths-and-needs/v1.0', Params('mode'), Params('uuid'), 'accommodation'])
 * // => '/strengths-and-needs/v1.0/edit/abc-123-def/accommodation'
 *
 * @example
 * // With query parameters
 * SANGenerators.createRoute(
 *   ['strengths-and-needs/v1.0', Params('mode'), Params('uuid'), 'accommodation'],
 *   [{name: 'resume', value: 'true'}]
 * )
 * // => '/strengths-and-needs/v1.0/edit/abc-123-def/accommodation?resume=true'
 *
 * @param pathSegments - Array of path segments (strings or resolvable expressions).
 *                       Segments may contain slashes which will be flattened.
 * @param queryParams - Optional array of query parameter objects with name and value.
 * @returns A URL pathname + optional query string (e.g., '/path/to/resource?key=value').
 */
export const createRoute =
  () =>
  (pathSegments: ResolvableString[], queryParams: QueryParam[] = []) => {
    const joined = (pathSegments as string[]) // Should be resolved at this point
      .flatMap(segment => segment?.split('/'))
      .filter(segment => segment !== null && segment !== undefined && segment.length > 0)
      .map(encodeURIComponent)
      .join('/')

    const path = joined ? `/${joined}` : '/'
    const route = new URL(`http://localhost${path}`)
    queryParams.forEach(({ name, value }) => route.searchParams.set(name, value))

    return route.pathname + route.search
  }
