import nunjucks from 'nunjucks'
import { formatDate } from '../../../../utils/utils'

const template = 'sentence-plan/views/partials/plan-header.njk'
const nunjucksEnv = nunjucks.configure(
  ['server/forms', 'server/views', 'node_modules/govuk-frontend/dist/', 'node_modules/@ministryofjustice/frontend/'],
  { autoescape: true },
)

nunjucksEnv.addFilter('formatSimpleDate', date => formatDate(date, 'simple'))

describe('plan header', () => {
  describe('print preview', () => {
    it('opens the print preview in a new tab', () => {
      const html = nunjucksEnv.render(template, {
        basePath: '/sentence-plan/v1.0',
        data: {
          caseData: {
            name: { forename: 'Joan', surname: 'Smith' },
            crn: 'X000000',
            dateOfBirth: '1990-01-01',
          },
        },
        headerPageHeading: "Joan's plan",
        buttons: { showPrintAllGoalsButton: true },
      })

      expect(html).toContain('Print all goals')
      expect(html).toContain('href="/sentence-plan/v1.0/plan/print-preview"')
      expect(html).toContain('target="_blank"')
      expect(html).toContain('rel="noopener"')
    })

    it('does not render Print all goals when showPrintAllGoalsButton is false', () => {
      const html = nunjucksEnv.render(template, {
        basePath: '/sentence-plan/v1.0',
        data: {
          caseData: {
            name: { forename: 'Joan', surname: 'Smith' },
            crn: 'X000000',
            dateOfBirth: '1990-01-01',
          },
        },
        headerPageHeading: "Joan's plan",
        buttons: { showPrintAllGoalsButton: false },
      })

      expect(html).not.toContain('Print all goals')
      expect(html).not.toContain('/sentence-plan/v1.0/plan/print-preview')
    })

    it('renders the read-only print preview actions', () => {
      const html = nunjucksEnv.render(template, {
        basePath: '/sentence-plan/v1.0',
        data: {
          caseData: {
            name: { forename: 'Joan', surname: 'Smith' },
            crn: 'X000000',
            dateOfBirth: '1990-01-01',
          },
        },
        headerPageHeading: "Joan's plan",
        buttons: { showExportAsPdfButton: true, showPrintButton: true },
      })

      const exportButton = html.match(/<a[^>]*data-ai-id="print-preview-export-pdf-button"[^>]*>/)?.[0]
      const printButton = html.match(/<button[^>]*data-ai-id="print-preview-print-button"[^>]*>/)?.[0]

      expect(exportButton).toContain('href="/sentence-plan/v1.0/plan/print-preview/pdf"')
      expect(printButton).toContain('data-print-sentence-plan')
    })

    it('hides the print button until JavaScript is enabled', () => {
      const html = nunjucksEnv.render(template, {
        data: {
          caseData: {
            name: { forename: 'Joan', surname: 'Smith' },
            crn: 'X000000',
            dateOfBirth: '1990-01-01',
          },
        },
        headerPageHeading: "Joan's plan",
        buttons: { showExportAsPdfButton: true, showPrintButton: true },
      })

      const printButton = html.match(/<button[^>]*data-ai-id="print-preview-print-button"[^>]*>/)?.[0]
      expect(printButton).toContain('js-only')
    })

    it('renders the data used by repeated print page headers', () => {
      const html = nunjucksEnv.render(template, {
        data: {
          caseData: {
            name: { forename: 'Joan', surname: 'Smith' },
            crn: 'X000000',
            pnc: '00/1000000X',
            dateOfBirth: '1990-01-01',
          },
        },
        headerPageHeading: "Joan's plan",
        showPrintPageHeaders: true,
        buttons: {},
      })

      expect(html).toContain('data-print-page-header')
      expect(html).toContain('data-print-plan-title="Joan&#39;s plan"')
      expect(html).toContain('data-print-person-name="Joan Smith"')
      expect(html).toContain('data-print-identifiers="CRN: X000000 | PNC: 00/1000000X | Date of birth: 1 January 1990"')
      expect(html).toContain('class="plan-header plan-header--print-preview"')
    })
  })

  describe('service downtime banner', () => {
    it('renders the service downtime banner when feature flag is enabled', () => {
      const html = nunjucksEnv.render(template, {
        data: {
          caseData: {
            name: { forename: 'Joan', surname: 'Smith' },
            crn: 'X000000',
            dateOfBirth: '1990-01-01',
          },
        },
        headerPageHeading: "Joan's plan",
        downtimeNotificationBanner: true,
      })

      expect(html).toContain('govuk-notification-banner__header')
      expect(html).toContain('govuk-notification-banner__content')
    })

    it('does not render the service downtime banner when feature flag is false', () => {
      const html = nunjucksEnv.render(template, {
        data: {
          caseData: {
            name: { forename: 'Joan', surname: 'Smith' },
            crn: 'X000000',
            dateOfBirth: '1990-01-01',
          },
        },
        headerPageHeading: "Joan's plan",
        downtimeNotificationBanner: false,
      })

      expect(html).not.toContain('govuk-notification-banner__header')
      expect(html).not.toContain('govuk-notification-banner__content')
    })
  })
})
