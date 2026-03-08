import { NavigationReferrer } from '../types'

const versionPrefix = '/sentence-plan/v[^/]+'

const navigationReferrerMatchers: ReadonlyArray<[RegExp, NavigationReferrer]> = [
  [new RegExp(`^${versionPrefix}/about-person$`), 'about'],
  [new RegExp(`^${versionPrefix}/plan/overview$`), 'plan-overview'],
  [new RegExp(`^${versionPrefix}/plan/plan-history$`), 'plan-history'],
  [new RegExp(`^${versionPrefix}/plan/previous-versions$`), 'previous-versions'],
  [new RegExp(`^${versionPrefix}/plan/view-historic/`), 'previous-versions'],
  [new RegExp(`^${versionPrefix}/goal/new/add-goal/[^/]+$`), 'add-goal'],
  [new RegExp(`^${versionPrefix}/goal/[^/]+/update-goal-steps$`), 'update-goal-steps'],
]

const getNavigationReferrerFromUrl = (url: string): NavigationReferrer | undefined => {
  const pathname = url.split('?')[0]

  return navigationReferrerMatchers.find(([pattern]) => pattern.test(pathname))?.[1]
}

export const getNavigationReferrerFromPageHistory = (
  pageHistory: readonly string[] = [],
): NavigationReferrer | undefined => {
  return [...pageHistory]
    .reverse()
    .map(getNavigationReferrerFromUrl)
    .find(referrer => referrer !== undefined)
}
