import { Format, Literal, Transformer } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKBody, GovUKHeading, GovUKList } from '@ministryofjustice/hmpps-forge/govuk-components'
import config from '../../../../config'

// GovUKBody text and GovUKList items render as raw HTML, so these links are trusted static markup
const link = (href: string, text: string) =>
  `<a href="${href}" class="govuk-link govuk-link--no-visited-state">${text}</a>`

const bulletList = (items: string[]) => GovUKList({ items, style: 'bullet', classes: 'govuk-!-margin-left-4' })

export const pageHeading = GovUKHeading({
  text: 'Accessibility statement for Assess and plan: Sentence plan',
  size: 'l',
  level: 1,
})

export const pageContent = [
  GovUKBody({ text: 'Last reviewed: 30 June 2026' }),
  GovUKBody({ text: 'This accessibility statement applies to the Sentence plan service.' }),
  GovUKBody({ text: 'This website is run by Justice Digital, part of the Ministry of Justice.' }),
  GovUKBody({
    text: 'We want as many people as possible to be able to use this website. For example, that means you should be able to:',
  }),
  bulletList([
    'change colours, contrast levels and fonts using browser or device settings',
    'zoom in up to 400% without the text spilling off the screen',
    'navigate most of the website using a keyboard or speech recognition software',
    'listen to most of the website using a screen reader (including the most recent versions of JAWS, NVDA and VoiceOver)',
  ]),
  GovUKBody({ text: 'We’ve also made the website text as simple as possible to understand.' }),
  GovUKBody({
    text: `AbilityNet has ${link('https://mcmw.abilitynet.org.uk', 'advice on making your device easier to use')} if you have a disability.`,
  }),

  GovUKHeading({ text: 'How accessible this website is', size: 'm', level: 2 }),
  GovUKBody({
    text: `This website is accessible. It has been tested against ${link('https://www.w3.org/TR/WCAG22', 'Web Content Accessibility Guidelines version 2.2')} standard.`,
  }),
  GovUKBody({ text: 'This website is fully compliant with the WCAG 2.2 AA standard.' }),

  GovUKHeading({ text: 'Feedback and contact information', size: 'm', level: 2 }),
  GovUKBody({
    text: Format(
      '<a href="%1" class="govuk-link govuk-link--no-visited-state">Contact us</a> if you:',
      Literal(config.nationalRolloutFeedbackUrl).pipe(Transformer.String.EscapeHtml()),
    ),
  }),
  bulletList(['find any problems not listed on this page', 'think we’re not meeting accessibility requirements']),

  GovUKHeading({ text: 'Enforcement procedure', size: 's', level: 3 }),
  GovUKBody({
    text: `The Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 (the ‘accessibility regulations’). If you’re not happy with how we respond to your complaint, ${link('https://www.equalityadvisoryservice.com', 'contact the Equality Advisory and Support Service (EASS)')}.`,
  }),

  GovUKHeading({ text: 'Preparation of this accessibility statement', size: 'm', level: 2 }),
  GovUKBody({ text: 'This statement was prepared on 1 April 2026. It was last reviewed on 30 June 2026.' }),
  GovUKBody({ text: 'This website was last tested on 24 June 2026 against the WCAG 2.2 AA standard.' }),
  GovUKBody({ text: 'This was a spot check following a full accessibility audit on 25 March 2026.' }),
  GovUKBody({ text: 'The tests were carried out by User Vision.' }),
  GovUKBody({ text: 'You can read the:' }),
  bulletList([
    link('https://uv3383-moj-arns-spot-check.uservisionaccessibility.co.uk/index.html', 'spot check report'),
    link(
      'https://uv3334-moj-arns-sentence-plan.uservisionaccessibility.co.uk/index.html',
      'full accessibility test report',
    ),
  ]),
]
