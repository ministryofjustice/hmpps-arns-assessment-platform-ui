import { block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'

export const pageHeading = block<HtmlBlock>({
  variant: 'html',
  content: '<h1 class="govuk-heading-l">Cookies policy for Assess and plan</h1>',
})

export const pageContent = block<HtmlBlock>({
  variant: 'html',
  content: `
    <p class="govuk-body">Last reviewed: 20 March 2026</p>

    <p class="govuk-body">This service stores small pieces of data (known as 'cookies') on your computer in order to operate, and to collect information about how you browse the site.</p>

    <p class="govuk-body">Cookies are used to:</p>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-left-4">
      <li>keep you logged in</li>
      <li>measure how you use the sites, so they can be updated and improved based on your needs</li>
    </ul>

    <p class="govuk-body">Third-party cookies are not used to identify you personally.</p>

    <h2 class="govuk-heading-m">Session cookies</h2>

    <p class="govuk-body">This service may store a cookie when you log in to open a session. The cookies used are classed as essential cookies. This means they are necessary to provide the online service, where they are used to transmit, carry out or facilitate the transmission of communications over a network.</p>

    <p class="govuk-body">These are the cookies this service uses:</p>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-left-4">
      <li>hmpps-arns-assessment-platform-preferences</li>
      <li>hmpps-arns-assessment-platform-ui.session</li>
    </ul>

    <h2 class="govuk-heading-m">Survey cookies</h2>

    <p class="govuk-body">Our feedback survey uses these cookies:</p>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-left-4">
      <li>SX_X</li>
      <li>_cfduid</li>
      <li>_cflb</li>
      <li>SS_CollectorPopup</li>
    </ul>

    <h2 class="govuk-heading-m">Analytics cookies</h2>

    <p class="govuk-body">Assess and plan may use Microsoft's Application Insights software to collect information about how you use the service. We do this to help make sure the service is meeting the needs of users, and to help us make improvements.</p>

    <p class="govuk-body">Application Insights stores information about:</p>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-left-4">
      <li>the pages you visit</li>
      <li>how long you spend on each page</li>
      <li>what you click while you're visiting the service</li>
    </ul>

    <p class="govuk-body">We do not allow Application Insights to collect or store your personal information (for example, your name or address). However, it does collect your NDelius username, which can be used to identify you.</p>
  `,
})
