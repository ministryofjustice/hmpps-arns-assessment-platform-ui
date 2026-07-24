import nunjucks from 'nunjucks'
import { formatDate } from '../../../../utils/utils'

const template = 'sentence-plan/views/partials/plan-header.njk'
const nunjucksEnv = nunjucks.configure(
  ['server/forms', 'server/views', 'node_modules/govuk-frontend/dist/', 'node_modules/@ministryofjustice/frontend/'],
  { autoescape: true },
)

nunjucksEnv.addFilter('formatSimpleDate', date => formatDate(date, 'simple'))

describe('plan header', () => {
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

    const printButton = html.match(/<button[^>]*data-ai-id="print-sentence-plan-button"[^>]*>/)?.[0]
    expect(printButton).toContain('js-only')
  })
})
