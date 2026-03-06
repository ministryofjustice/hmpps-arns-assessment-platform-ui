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

export const getNavigationReferrerFromPreviousPageUrl = (previousPageUrl?: string): NavigationReferrer | undefined => {
  if (!previousPageUrl) {
    return undefined
  }

  const pathname = previousPageUrl.split('?')[0]

  return navigationReferrerMatchers.find(([pattern]) => pattern.test(pathname))?.[1]
}
