import { HtmlBlock } from '@form-engine/registry/components/html'

export const pageHeading = HtmlBlock({
  content: '<h1 class="govuk-heading-l">Accessibility statement for Assess and plan: Sentence plan</h1>',
})

export const pageContent = HtmlBlock({
  content: `
    <p class="govuk-body">Last reviewed: 8 April 2026</p>
    <p class="govuk-body">This accessibility statement applies to the Sentence plan service.</p>
    <p class="govuk-body">This website is run by Justice Digital, part of the Ministry of Justice.</p>

    <p class="govuk-body">We want as many people as possible to be able to use this website. For example, that means you should be able to:</p>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-left-4">
      <li>change colours, contrast levels and fonts using browser or device settings</li>
      <li>zoom in up to 400% without the text spilling off the screen</li>
      <li>navigate most of the website using a keyboard or speech recognition software</li>
      <li>listen to most of the website using a screen reader (including the most recent versions of JAWS, NVDA and VoiceOver)</li>
    </ul>

    <p class="govuk-body">We’ve also made the website text as simple as possible to understand.</p>
    <p class="govuk-body">
      AbilityNet has
        <a href="https://mcmw.abilitynet.org.uk/" class="govuk-link govuk-link--no-visited-state" rel="noreferrer noopener" target="_blank">
            advice on making your device easier to use (opens in a new tab)
        </a>
      if you have a disability.
    </p>

    <h2 class="govuk-heading-m">How accessible this website is</h2>
    <p class="govuk-body">We know some parts of this website are not fully accessible:</p>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-left-4">
      <li>Horizontal scrolling is required at 250% browser zoom and above. This makes navigation slower and more difficult.</li>
      <li>The service name disappears at browser zoom of 150% and above.</li>
      <li>Hint text underneath questions is not programmatically associated with form fields.</li>
      <li>Inline validation errors are not always announced by screen readers, which means that errors are not always highlighted.</li>
      <li>Conditionally revealed inputs could be made clearer on the ‘create goal’ and ‘change goal’ pages.</li>
      <li>Keyboard focus does not move to the expanded ‘Report a problem’ section when the link is selected.</li>
      <li>The ‘skip to main content’ link bypasses important actions within the main content (for example, the ‘create goal’ and ‘agree plan’ buttons).</li>
      <li>There are multiple banner landmarks to identify different parts of the pages, which might cause confusion.</li>
    </ul>

    <h2 class="govuk-heading-m">Feedback and contact information</h2>
    <p class="govuk-body">
      <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=KEeHxuZx_kGp4S6MNndq2NZZrIGKlVRMlQWYqMMLQ_ZUQU4xRlA2RTQ0UFlXV1lJWjRPRlVSRE5LOS4u" class="govuk-link govuk-link--no-visited-state" rel="noreferrer noopener" target="_blank">
          Contact us (opens in a new tab)
      </a>
      if you:
    </p>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-left-4">
      <li>find any problems not listed on this page</li>
      <li>think we’re not meeting accessibility requirements</li>
    </ul>

    <h3 class="govuk-heading-s">Enforcement procedure</h3>
    <p class="govuk-body">
      The Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 (the ‘accessibility regulations’).
      If you’re not happy with how we respond to your complaint,
      <a href="https://www.equalityadvisoryservice.com" class="govuk-link govuk-link--no-visited-state" rel="noreferrer noopener" target="_blank">
          contact the Equality Advisory and Support Service (EASS) (opens in a new tab)
      </a>
      .
    </p>

    <h2 class="govuk-heading-m">Technical information about this website’s accessibility</h2>
    <p class="govuk-body">Justice Digital is committed to making its website accessible, in accordance with the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018.</p>

    <h3 class="govuk-heading-s">Compliance status</h3>
    <p class="govuk-body">The website has been tested against the Web Content Accessibility Guidelines (WCAG) 2.2 AA standard.</p>
    <p class="govuk-body">
      This website is partially compliant with the
      <a href="https://www.w3.org/TR/WCAG22" class="govuk-link govuk-link--no-visited-state" rel="noreferrer noopener" target="_blank">
          Web Content Accessibility Guidelines version 2.2 (opens in a new tab)
      </a>
      AA standard, due to the non-compliances listed below.
    </p>

    <h2 class="govuk-heading-m">Non-accessible content</h2>
    <p class="govuk-body">The content listed below is non-accessible. There are 8 WCAG issues. These are listed below.</p>

    <h3 class="govuk-heading-s">Responsive design and visual layout</h3>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-left-4">
        <li>Horizontal scrolling is required at 250% browser zoom and above. This makes navigation slower and more difficult. This fails WCAG success criterion 1.4.10 (reflow).</li>
        <li>The service name disappears at browser zoom of 150% and above. Only ‘HMPPS’ is visible instead of ‘HMPPS Assess and plan’, so the visible link no longer describes the location.
        Screen reader behaviour matches this. This fails WCAG success criteria 1.4.10 (reflow) and 1.4.4 (resize text).</li>
    </ul>

    <h3 class="govuk-heading-s">Screen reader announcements</h3>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-left-4">
        <li>Extra instructions on some form fields, presented visually as hint text underneath questions, are not programmatically associated with form fields.
        This means that the extra instructions are not announced, so screen reader users may miss important information. This fails WCAG success criterion 1.3.1 (info and relationships).</li>
        <li>Inline validation errors are displayed next to the relevant form fields to show where errors are.
        These are not announced by screen readers when they appear. This fails WCAG success criterion 1.3.1 (info and relationships).</li>
        <li>Conditionally revealed inputs could be made clearer on the ‘create goal’ and ‘change goal’ pages.
        If you select ‘yes’ to the question ‘Can [name] start working on this goal now?’, additional related inputs are revealed.
        The relationship between the radio and the conditionally revealed inputs is not as obvious for screen reader users as it is for sighted users.
        This fails  WCAG success criteria 1.3.1 (info and relationships) and 4.1.2 (name, role, value).</li>
    </ul>

    <h3 class="govuk-heading-s">Keyboard operability</h3>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-left-4">
        <li>Keyboard focus does not move to the expanded ‘Report a problem’ section when the link is selected.
        Focus remains on the original link, creating a mismatch between what is shown visually and where keyboard focus is positioned.
        This fails WCAG success criterion 2.4.3 (focus order).</li>
        <li>The ‘skip to main content’ link bypasses important actions within the main content (for example, the ‘create goal’ and ‘agree plan’ buttons).
        These should be part of the main content. This fails WCAG success criterion 1.3.1 (info and relationships).</li>
    </ul>

    <h3 class="govuk-heading-s">Page structure and navigation</h3>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-left-4">
        <li>There are multiple banner landmarks to identify different parts of the pages. Banners are used for elements that are not actually banners, which might cause confusion.
        There is also an empty navigation landmark. This fails WCAG success criterion 1.3.1 (info and relationships).</li>
    </ul>

    <h2 class="govuk-heading-m">What we’re doing to improve accessibility</h2>
    <p class="govuk-body">We are working on fixing these issues. We will have fixed most of them by November 2026.</p>

    <h2 class="govuk-heading-m">Preparation of this accessibility statement</h2>
    <p class="govuk-body">This statement was prepared on 1 April 2026. It was last reviewed on 8 April 2026.</p>
    <p class="govuk-body">This website was last tested on 25 March 2026 against the WCAG 2.2 AA standard.</p>
    <p class="govuk-body">The test was carried out by User Vision.</p>
    <p class="govuk-body">
        You can read the
        <a href="https://uv3334-moj-arns-sentence-plan.uservisionaccessibility.co.uk/index.html" class="govuk-link govuk-link--no-visited-state" rel="noreferrer noopener" target="_blank">
            full accessibility test report (opens in a new tab)
        </a>
        .
    </p>
  `,
})
