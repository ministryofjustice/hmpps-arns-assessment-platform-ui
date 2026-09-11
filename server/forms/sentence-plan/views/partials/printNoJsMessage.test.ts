import nunjucks from 'nunjucks'

const template = 'sentence-plan/views/partials/print-no-js-message.njk'
const nunjucksEnv = nunjucks.configure(
  ['server/forms', 'server/views', 'node_modules/govuk-frontend/dist/', 'node_modules/@ministryofjustice/frontend/'],
  { autoescape: true },
)

describe('print no-JavaScript message', () => {
  it('renders a keyboard-print message inside a <noscript> when the print button is shown', () => {
    const html = nunjucksEnv.render(template, { buttons: { showPrintButton: true } })

    const noscript = html.match(/<noscript>[\s\S]*?<\/noscript>/)?.[0]

    expect(noscript).toContain('data-qa="print-no-js-message"')
    expect(noscript).toContain('Use your keyboard to print')
    expect(noscript).toContain(
      'There is no print button because you do not have JavaScript enabled. To print this page, use Ctrl + P on a PC or Cmd + P on a Mac.',
    )
  })

  it('hides the message when printing', () => {
    const html = nunjucksEnv.render(template, { buttons: { showPrintButton: true } })

    const wrapper = html.match(/<div[^>]*data-qa="print-no-js-message"[^>]*>/)?.[0]

    expect(wrapper).toContain('govuk-!-display-none-print')
  })

  it('renders nothing when the print button is not shown', () => {
    const html = nunjucksEnv.render(template, { buttons: {} })

    expect(html).not.toContain('print-no-js-message')
    expect(html.trim()).toBe('')
  })
})
