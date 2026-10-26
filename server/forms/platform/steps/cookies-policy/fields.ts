import { GovUKBody, GovUKHeading, GovUKList } from '@ministryofjustice/hmpps-forge/govuk-components'

const bulletList = (items: string[]) => GovUKList({ items, style: 'bullet', classes: 'govuk-!-margin-left-4' })

export const pageHeading = GovUKHeading({ text: 'Cookies policy for Assess and plan', size: 'l', level: 1 })

export const pageContent = [
  GovUKBody({ text: 'Last reviewed: 20 March 2026' }),
  GovUKBody({
    text: "This service stores small pieces of data (known as 'cookies') on your computer in order to operate, and to collect information about how you browse the site.",
  }),
  GovUKBody({ text: 'Cookies are used to:' }),
  bulletList([
    'keep you logged in',
    'measure how you use the sites, so they can be updated and improved based on your needs',
  ]),
  GovUKBody({ text: 'Third-party cookies are not used to identify you personally.' }),

  GovUKHeading({ text: 'Session cookies', size: 'm', level: 2 }),
  GovUKBody({
    text: 'This service may store a cookie when you log in to open a session. The cookies used are classed as essential cookies. This means they are necessary to provide the online service, where they are used to transmit, carry out or facilitate the transmission of communications over a network.',
  }),
  GovUKBody({ text: 'These are the cookies this service uses:' }),
  bulletList(['hmpps-arns-assessment-platform-preferences', 'hmpps-arns-assessment-platform-ui.session']),

  GovUKHeading({ text: 'Survey cookies', size: 'm', level: 2 }),
  GovUKBody({ text: 'Our feedback survey uses these cookies:' }),
  bulletList(['SX_X', '_cfduid', '_cflb', 'SS_CollectorPopup']),

  GovUKHeading({ text: 'Analytics cookies', size: 'm', level: 2 }),
  GovUKBody({
    text: "Assess and plan may use Microsoft's Application Insights software to collect information about how you use the service. We do this to help make sure the service is meeting the needs of users, and to help us make improvements.",
  }),
  GovUKBody({ text: 'Application Insights stores information about:' }),
  bulletList([
    'the pages you visit',
    'how long you spend on each page',
    "what you click while you're visiting the service",
  ]),
  GovUKBody({
    text: 'We do not allow Application Insights to collect or store your personal information (for example, your name or address). However, it does collect your NDelius username, which can be used to identify you.',
  }),
]
