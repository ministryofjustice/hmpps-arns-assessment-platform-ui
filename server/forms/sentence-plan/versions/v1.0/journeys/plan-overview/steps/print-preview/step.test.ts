import { not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { planOverviewJourney } from '../..'
import { sentencePlanOverviewPath } from '../../../../constants'
import { hasPostAgreementStatus } from '../../../../guards'
import {
  achievedGoalsSection,
  activeGoalsSection,
  draftPlanWatermark,
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
      draftPlanWatermark,
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

  it('adds a draft-only watermark to the print preview', () => {
    expect(draftPlanWatermark).toMatchObject({
      template: expect.stringContaining('class="draft-plan-watermark" aria-hidden="true">DRAFT</div>'),
      visibleWhen: not(hasPostAgreementStatus),
    })
  })

  it.each([
    ['active', activeGoalsSection],
    ['future', futureGoalsSection],
    ['achieved', achievedGoalsSection],
    ['removed', removedGoalsSection],
  ])('identifies the %s goal area for print page breaks', (status, section) => {
    expect(section).toMatchObject({
      template: expect.stringContaining(`print-goal-section print-goal-section--${status}`),
    })
  })
})
