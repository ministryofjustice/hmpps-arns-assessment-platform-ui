import { planOverviewJourney } from '../..'
import { sentencePlanOverviewPath } from '../../../../constants'
import {
  achievedGoalsSection,
  activeGoalsSection,
  futureGoalsSection,
  planAgreedMessage,
  planCreatedMessage,
  planLastUpdatedMessage,
  removedGoalsSection,
} from './fields'
import { printPreviewStep } from './step'

describe('print preview step', () => {
  it('is registered within the plan overview journey', () => {
    expect(printPreviewStep).toMatchObject({
      path: '/print-preview',
      title: 'Print preview',
      view: {
        locals: {
          user: null,
          disableHeaderLink: true,
          hideNavigation: true,
          hidePreviousVersions: true,
          hidePhaseBanner: true,
          hideBackToTop: true,
          buttons: {
            showExportAsPdfButton: true,
            showPrintButton: true,
          },
        },
      },
    })
    expect(printPreviewStep.blocks).toEqual([
      planLastUpdatedMessage,
      planAgreedMessage,
      planCreatedMessage,
      activeGoalsSection,
      futureGoalsSection,
      achievedGoalsSection,
      removedGoalsSection,
    ])
    expect(printPreviewStep.onAccess?.[0]?.next).toEqual([expect.objectContaining({ goto: sentencePlanOverviewPath })])
    expect(planOverviewJourney.steps).toContainEqual(printPreviewStep)
  })
})
