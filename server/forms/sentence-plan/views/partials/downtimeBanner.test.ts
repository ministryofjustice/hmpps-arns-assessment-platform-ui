import nunjucks from 'nunjucks'
import { formatDate } from '../../../../utils/utils'

const nunjucksEnv = nunjucks.configure(
  ['server/forms', 'server/views', 'node_modules/govuk-frontend/dist/', 'node_modules/@ministryofjustice/frontend/'],
  { autoescape: true },
)

nunjucksEnv.addFilter('formatSimpleDate', date => formatDate(date, 'simple'))
nunjucksEnv.addFilter('assetMap', url => url)

const context = {
  data: {
    caseData: {
      name: { forename: 'Joan', surname: 'Smith' },
      crn: 'X000000',
      dateOfBirth: '1990-01-01',
    },
  },
  step: { title: 'Privacy policy' },
  hideSessionTimeoutModal: true,
  featureFlags: { downtimeNotificationBanner: true },
  downtimeBanner: { heading: 'Scheduled maintenance', message: 'The service will be unavailable tomorrow.' },
}

describe.each(['sentence-plan/views/partials/plan-header.njk', 'platform/views/platform-policy-step.njk'])(
  'downtime banner in %s',
  template => {
    it('renders the configured content', () => {
      const html = nunjucksEnv.render(template, context)

      expect(html).toContain('data-qa="downtime-banner"')
      expect(html).toContain(context.downtimeBanner.heading)
      expect(html).toContain(context.downtimeBanner.message)
      expect(html).toContain('govuk-!-display-none-print')
    })

    it('does not render when the boolean flag is disabled', () => {
      const html = nunjucksEnv.render(template, {
        ...context,
        featureFlags: { downtimeNotificationBanner: false },
      })

      expect(html).not.toContain('data-qa="downtime-banner"')
      expect(html).not.toContain(context.downtimeBanner.message)
    })

    it('does not render when valid content is unavailable', () => {
      const html = nunjucksEnv.render(template, { ...context, downtimeBanner: undefined })

      expect(html).not.toContain('data-qa="downtime-banner"')
      expect(html).not.toContain('5 November 2026')
    })

    it('escapes the heading and message rather than rendering HTML', () => {
      const html = nunjucksEnv.render(template, {
        ...context,
        downtimeBanner: { heading: '<script>alert(1)</script>', message: '<b>Maintenance & updates</b>' },
      })

      expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
      expect(html).toContain('&lt;b&gt;Maintenance &amp; updates&lt;/b&gt;')
      expect(html).not.toContain('<script>alert(1)</script>')
      expect(html).not.toContain('<b>Maintenance & updates</b>')
    })
  },
)

it('does not render the downtime banner on the print preview', () => {
  const html = nunjucksEnv.render('sentence-plan/views/partials/plan-header.njk', {
    ...context,
    showPrintPageHeaders: true,
  })

  expect(html).not.toContain('data-qa="downtime-banner"')
  expect(html).toContain('data-print-page-header')
})
