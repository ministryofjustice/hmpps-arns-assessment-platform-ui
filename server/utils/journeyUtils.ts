// These are to be deleted when we're feeding locals from proper data
export const htmlBlocks: string[] = [
  `
  <section class="govuk-!-margin-bottom-6">
    <h2 class="govuk-heading-m">What you'll need</h2>
    <ul class="govuk-list govuk-list--bullet">
      <li>Lorem ipsum dolor sit amet</li>
      <li>Consectetur adipiscing elit</li>
      <li>Vestibulum ante ipsum primis</li>
      <li>Curabitur commodo nisi non urna malesuada</li>
    </ul>
  </section>
  `,
  `
  <section class="govuk-!-margin-bottom-6">
    <h2 class="govuk-heading-m">Warning</h2>
    <div class="govuk-warning-text">
      <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
      <strong class="govuk-warning-text__text">
        <span class="govuk-visually-hidden">Warning</span>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sed lectus ac nisi viverra feugiat.
      </strong>
    </div>
  </section>
  `,
]

export function createNavigation() {
  const labels = ['ROSH Screening', 'ROSH full analysis', 'ROSH summary', 'Risk management plan']

  return labels.map((label, index) => ({
    url: '/',
    label,
    active: index === 0,
  }))
}
