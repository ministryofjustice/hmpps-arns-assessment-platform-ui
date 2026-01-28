import { block, step, Query, Conditional } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKLinkButton } from '@form-engine-govuk-components/components'

export const unsavedInformationDeletedStep = step({
  path: '/unsaved-information-deleted',
  title: 'Your unsaved information has been deleted',
  view: {
    template: 'sentence-plan/views/simple-page',
    locals: {
      pageTitle: 'Your unsaved information has been deleted - Sentence plan',
      hideSessionTimeoutModal: true, // Don't show timeout modal on the timeout destination page
      hmppsHeaderServiceNameLink: '/sentence-plan/v1.0/plan/overview',
    },
  },
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Your unsaved information has been deleted</h1>
        <div data-qa="unsaved-information-deleted-content">
          <p class="govuk-body">This is to protect your information.</p>
          <p class="govuk-body">You can go to the plan to start again.</p>
        </div>
      `,
    }),
    block<GovUKLinkButton>({
      variant: 'govukLinkButton',
      text: 'Go to the plan',
      // If user came via OASys handover, redirect to handover sign-in to re-authenticate
      // Otherwise, go to plan overview (which will redirect to HMPPS Auth if session expired)
      href: Conditional({
        when: Query('auth').match(Condition.Equals('handover')),
        then: '/sign-in/handover?service=sentence-plan',
        else: '/sentence-plan/v1.0/plan/overview',
      }),
    }),
  ],
})
