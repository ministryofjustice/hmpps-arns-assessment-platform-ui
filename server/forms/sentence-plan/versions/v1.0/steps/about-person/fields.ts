import { Data, Format, Item, when } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { MOJAlert } from '@form-engine-moj-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'

// ============================================================================
// Warning Banners
// ============================================================================

/**
 * Warning banner shown when assessment is incomplete
 */
export const incompleteAssessmentWarning = MOJAlert({
  hidden: Data('assessmentInfo.isAssessmentComplete').match(Condition.Equals(true)),
  alertVariant: 'warning',
  title: 'Assessment incomplete',
  text: 'Some areas of the assessment have not been completed. You can still create goals but may be missing important information.',
})

/**
 * Warning banner shown when Delius data is unavailable
 */
export const deliusDataWarning = MOJAlert({
  hidden: Data('deliusDataError').not.match(Condition.Equals(true)),
  alertVariant: 'warning',
  title: 'Sentence information unavailable',
  text: 'We could not load sentence information from nDelius. Try refreshing the page or contact support if the problem persists.',
})

/**
 * Warning banner shown when assessment data is unavailable
 */
export const assessmentDataWarning = MOJAlert({
  hidden: Data('assessmentDataError').not.match(Condition.Equals(true)),
  alertVariant: 'warning',
  title: 'Assessment information unavailable',
  text: 'We could not load assessment information. Try refreshing the page or contact support if the problem persists.',
})

// ============================================================================
// Sentence Information Section
// ============================================================================

/**
 * Table row for a single sentence
 */
const sentenceTableRow = HtmlBlock({
  content: Format(
    `<tr class="govuk-table__row">
      <td class="govuk-table__cell">%1%2</td>
      <td class="govuk-table__cell">%3</td>
      <td class="govuk-table__cell">%4</td>
      <td class="govuk-table__cell">%5</td>
    </tr>`,
    Item().path('description'),
    when(Item().path('sentenceLength').match(Condition.IsRequired()))
      .then(Format(' (%1)', Item().path('sentenceLength')))
      .else(''),
    when(Item().path('endDate').match(Condition.IsRequired())).then(Item().path('endDate')).else('Not set'),
    when(Item().path('hasUnpaidWork').match(Condition.Equals(true)))
      .then(Format('%1 hours', Item().path('unpaidWorkHours')))
      .else('No'),
    when(Item().path('hasRar').match(Condition.Equals(true)))
      .then(Format('%1 days', Item().path('rarDays')))
      .else('No'),
  ),
})

/**
 * Sentence information table
 */
const sentenceTable = TemplateWrapper({
  hidden: Data('deliusDataError').match(Condition.Equals(true)),
  template: `
    <table class="govuk-table">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header">Sentence</th>
          <th scope="col" class="govuk-table__header">End date</th>
          <th scope="col" class="govuk-table__header">Unpaid work</th>
          <th scope="col" class="govuk-table__header">RAR</th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        {{slot:rows}}
      </tbody>
    </table>
  `,
  slots: {
    rows: [
      CollectionBlock({
        collection: Data('formattedSentences').each(Iterator.Map(sentenceTableRow)),
      }),
    ],
  },
})

/**
 * Complete sentence information section with heading
 */
export const sentenceInformationSection = TemplateWrapper({
  template: `
    <h2 class="govuk-heading-m govuk-!-margin-top-6">Sentence information</h2>
    {{slot:content}}
  `,
  slots: {
    content: [deliusDataWarning, sentenceTable],
  },
})

// ============================================================================
// Assessment Information Section
// ============================================================================

/**
 * Assessment area accordion item template - renders a complete accordion section
 * with title, risk badges, and detailed content
 */
const assessmentAreaAccordionItem = HtmlBlock({
  content: Format(
    `<div class="govuk-accordion__section">
      <div class="govuk-accordion__section-header">
        <h3 class="govuk-accordion__section-heading">
          <span class="govuk-accordion__section-button" id="accordion-area-%1-heading">
            %2
            %3
            %4
          </span>
        </h3>
      </div>
      <div id="accordion-area-%1-content" class="govuk-accordion__section-content">
        <dl class="govuk-summary-list govuk-summary-list--no-border">
          %5
          %6
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Motivation to make changes</dt>
            <dd class="govuk-summary-list__value">%7</dd>
          </div>
          %8
          %9
        </dl>
        <p class="govuk-body govuk-!-margin-top-4">
          <a href="%10" class="govuk-link govuk-link--no-visited-state">Create a goal for this area</a>
        </p>
      </div>
    </div>`,
    // %1 - slug for IDs
    Item().path('slug'),
    // %2 - title
    Item().path('title'),
    // %3 - RoSH badge
    when(Item().path('linkedToHarm').match(Condition.Equals('YES')))
      .then('<strong class="govuk-tag govuk-tag--red govuk-!-margin-left-2">RoSH</strong>')
      .else(''),
    // %4 - Reoffending badge
    when(Item().path('linkedToReoffending').match(Condition.Equals('YES')))
      .then('<strong class="govuk-tag govuk-tag--orange govuk-!-margin-left-2">Reoffending</strong>')
      .else(''),
    // %5 - Linked to harm details row (only if linked)
    when(Item().path('linkedToHarm').match(Condition.Equals('YES')))
      .then(
        Format(
          `<div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Linked to risk of serious harm</dt>
            <dd class="govuk-summary-list__value">%1</dd>
          </div>`,
          when(Item().path('riskOfSeriousHarmDetails').match(Condition.IsRequired()))
            .then(Item().path('riskOfSeriousHarmDetails'))
            .else('Yes'),
        ),
      )
      .else(''),
    // %6 - Linked to reoffending details row (only if linked)
    when(Item().path('linkedToReoffending').match(Condition.Equals('YES')))
      .then(
        Format(
          `<div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Linked to reoffending</dt>
            <dd class="govuk-summary-list__value">%1</dd>
          </div>`,
          when(Item().path('riskOfReoffendingDetails').match(Condition.IsRequired()))
            .then(Item().path('riskOfReoffendingDetails'))
            .else('Yes'),
        ),
      )
      .else(''),
    // %7 - Motivation value
    when(Item().path('motivationToMakeChanges').match(Condition.IsRequired()))
      .then(Item().path('motivationToMakeChanges'))
      .else('Not recorded'),
    // %8 - Strengths row (only if linked)
    when(Item().path('linkedToStrengthsOrProtectiveFactors').match(Condition.Equals('YES')))
      .then(
        Format(
          `<div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Strengths or protective factors</dt>
            <dd class="govuk-summary-list__value">%1</dd>
          </div>`,
          when(Item().path('strengthsOrProtectiveFactorsDetails').match(Condition.IsRequired()))
            .then(Item().path('strengthsOrProtectiveFactorsDetails'))
            .else('Yes'),
        ),
      )
      .else(''),
    // %9 - Need score row (only if available)
    when(Item().path('criminogenicNeedsScore').match(Condition.IsRequired()))
      .then(
        Format(
          `<div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Criminogenic needs score</dt>
            <dd class="govuk-summary-list__value">%1 out of %2</dd>
          </div>`,
          Item().path('criminogenicNeedsScore'),
          Item().path('upperBound'),
        ),
      )
      .else(''),
    // %10 - Goal route
    Item().path('goalRoute'),
  ),
})

/**
 * Assessment areas accordion for a category
 */
const buildAssessmentAccordion = (id: string, dataPath: string) =>
  TemplateWrapper({
    hidden: Data(dataPath).not.match(Condition.IsRequired()),
    template: `<div class="govuk-accordion" data-module="govuk-accordion" id="accordion-${id}">{{slot:items}}</div>`,
    slots: {
      items: [
        CollectionBlock({
          collection: Data(dataPath).each(Iterator.Map(assessmentAreaAccordionItem)),
        }),
      ],
    },
  })

/**
 * High scoring areas section
 */
const highScoringSection = TemplateWrapper({
  hidden: Data('assessmentInfo.areas.highScoring').not.match(Condition.IsRequired()),
  template: `
    <h3 class="govuk-heading-s govuk-!-margin-top-4">Higher scoring criminogenic needs</h3>
    <p class="govuk-body">Areas where the assessment indicates a higher need for intervention.</p>
    {{slot:accordion}}
  `,
  slots: {
    accordion: [buildAssessmentAccordion('high-scoring', 'assessmentInfo.areas.highScoring')],
  },
})

/**
 * Low scoring areas section
 */
const lowScoringSection = TemplateWrapper({
  hidden: Data('assessmentInfo.areas.lowScoring').not.match(Condition.IsRequired()),
  template: `
    <h3 class="govuk-heading-s govuk-!-margin-top-4">Lower scoring criminogenic needs</h3>
    <p class="govuk-body">Areas where the assessment indicates a lower need for intervention.</p>
    {{slot:accordion}}
  `,
  slots: {
    accordion: [buildAssessmentAccordion('low-scoring', 'assessmentInfo.areas.lowScoring')],
  },
})

/**
 * Other areas section (without scoring, e.g., Finances, Health)
 */
const otherAreasSection = TemplateWrapper({
  hidden: Data('assessmentInfo.areas.other').not.match(Condition.IsRequired()),
  template: `
    <h3 class="govuk-heading-s govuk-!-margin-top-4">Other areas</h3>
    <p class="govuk-body">Areas that do not have a criminogenic needs score.</p>
    {{slot:accordion}}
  `,
  slots: {
    accordion: [buildAssessmentAccordion('other', 'assessmentInfo.areas.other')],
  },
})

/**
 * Incomplete areas list item
 */
const incompleteAreaItem = HtmlBlock({
  content: Format('<li>%1</li>', Item().path('title')),
})

/**
 * Incomplete areas section
 */
const incompleteAreasSection = TemplateWrapper({
  hidden: Data('assessmentInfo.areas.incompleteAreas').not.match(Condition.IsRequired()),
  template: `
    <h3 class="govuk-heading-s govuk-!-margin-top-4">Incomplete areas</h3>
    <p class="govuk-body">The following areas have not been completed in the assessment:</p>
    <ul class="govuk-list govuk-list--bullet">{{slot:items}}</ul>
  `,
  slots: {
    items: [
      CollectionBlock({
        collection: Data('assessmentInfo.areas.incompleteAreas').each(Iterator.Map(incompleteAreaItem)),
      }),
    ],
  },
})

/**
 * Last updated information
 */
const assessmentLastUpdated = HtmlBlock({
  hidden: Data('assessmentInfo.versionUpdatedAt').not.match(Condition.IsRequired()),
  content: Format(
    '<p class="govuk-body-s govuk-!-margin-top-2 govuk-!-margin-bottom-4">Assessment last updated: %1</p>',
    Data('assessmentInfo.versionUpdatedAt'),
  ),
})

/**
 * Complete assessment information section
 */
export const assessmentInformationSection = TemplateWrapper({
  template: `
    <h2 class="govuk-heading-m govuk-!-margin-top-6">Assessment information</h2>
    {{slot:content}}
  `,
  slots: {
    content: [
      assessmentDataWarning,
      assessmentLastUpdated,
      highScoringSection,
      lowScoringSection,
      otherAreasSection,
      incompleteAreasSection,
    ],
  },
})

// ============================================================================
// Continue Button
// ============================================================================

export const continueButton = GovUKButton({
  text: 'Continue',
  name: 'action',
  value: 'continue',
  classes: 'govuk-!-margin-top-6',
})
