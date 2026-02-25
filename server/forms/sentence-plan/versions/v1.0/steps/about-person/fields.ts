import { and, Data, Format, Item, not, or, when } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { GovUKAccordion, GovUKTable, GovUKWarningText } from '@form-engine-govuk-components/components'
import { MOJBanner } from '@form-engine-moj-components/components'
import { CaseData, sentencePlanOverviewPath } from '../../constants'
import { AssessmentInfoDetails } from '../../../../components'

// condition to check if assessment data failed to load - used to hide area sections on error and display warning
const isAssessmentError = Data('allAreasAssessmentStatus').match(Condition.Equals('error'))

// condition to check if NDelius data (sentences) failed to load
const isSentenceInformationEmpty = Data('caseData.sentences').not.match(Condition.IsRequired())

// condition for when both assessment and NDelius sentence data failed to load
export const isSentenceInformationAndAssessmentLoadingError = and(isAssessmentError, isSentenceInformationEmpty)

// Combined error message shown when both assessment AND NDelius data failed to load
// Note: The h1 heading is set via headerPageHeading in step.ts
export const sentenceInformationMissingAndAssessmentErrorMessage = HtmlBlock({
  hidden: not(isSentenceInformationAndAssessmentLoadingError),
  content: Format(
    `<p class="govuk-body">Try reloading the page. You can do this by pressing F5 (on a PC), or Cmd + R (on a Mac).</p>
    <p class="govuk-body">If the page still does not load, try again later or <a href="${sentencePlanOverviewPath}" class="govuk-link">go to %1's plan</a>.</p>`,
    CaseData.Forename,
  ),
})

// MoJ banner shown when the assessment is not yet complete:
export const incompleteAssessmentWarning = MOJBanner({
  hidden: or(
    isAssessmentError,
    isSentenceInformationAndAssessmentLoadingError,
    Data('isAssessmentComplete').match(Condition.Equals(true)),
  ),
  bannerType: 'warning',
  html: `
     <h2 class='govuk-heading-m'>Some areas have incomplete information</h2>
     <p class="govuk-body">This means the areas have not been marked as complete in the assessment, but you can still see the latest information available.</p>
  `,
  attributes: { 'data-qa': 'incomplete-assessment-warning' },
})

// Assessment Last Updated:
export const assessmentLastUpdated = HtmlBlock({
  hidden: or(
    isSentenceInformationAndAssessmentLoadingError,
    not(Data('assessmentLastUpdated').match(Condition.IsRequired())),
  ),
  content: Format(
    '<p class="govuk-body govuk-!-margin-bottom-1"> %1 assessment was last updated on %2.</p>',
    CaseData.ForenamePossessive,
    Data('assessmentLastUpdated'),
  ),
})

// -------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------
// Sentence information starts

export const sentenceHeading = HtmlBlock({
  hidden: isSentenceInformationAndAssessmentLoadingError,
  content: '<h2 class="govuk-heading-m">Sentence information</h2>',
})

// Table displaying sentence details with unpaid work and RAR progress:
export const sentenceTable = GovUKTable({
  hidden: or(isSentenceInformationAndAssessmentLoadingError, isSentenceInformationEmpty),
  classes: 'sentence-information-table',
  head: [
    { text: 'Sentence' },
    { text: 'Expected end date' },
    { text: 'Unpaid work' },
    { text: 'RAR (Rehabilitation activity requirement)' },
  ],
  rows: Data('caseData.sentences').each(
    Iterator.Map([
      {
        html: Format(
          '%1<br>%2',
          Item().path('description'),
          Item()
            .path('startDate')
            .pipe(Transformer.String.ToSentenceLength(Item().path('endDate'))),
        ),
      },
      { text: Item().path('endDate').pipe(Transformer.String.ToDate(), Transformer.Date.ToUKLongDate()) },
      {
        text: when(Item().path('unpaidWorkHoursOrdered').match(Condition.Number.GreaterThan(0)))
          .then(Format('%1 hours', Item().path('unpaidWorkHoursOrdered')))
          .else('No'),
      },
      {
        text: when(Item().path('rarRequirement').match(Condition.Equals(true)))
          .then(Format('%1 days', Item().path('rarDaysOrdered')))
          .else('No'),
      },
    ]),
  ),
  attributes: { 'data-qa': 'sentence-table' },
})

// Warning shown when NDelius data (sentence details with unpaid work and RAR progress) failed to load:
export const noSentenceInfo = GovUKWarningText({
  hidden: or(isSentenceInformationAndAssessmentLoadingError, not(isSentenceInformationEmpty)),
  text: 'There is a problem getting the sentence information from NDelius. Try reloading the page or try again later',
  iconFallbackText: 'Warning',
  attributes: { 'data-qa': 'no-sentence-info-warning' },
})
// -------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------
// Sentence information ends

// Warning shown when assessment data failed to load:
export const noAssessmentDataErrorWarning = GovUKWarningText({
  hidden: or(isSentenceInformationAndAssessmentLoadingError, not(isAssessmentError)),
  text: 'There is a problem getting assessment information. Try reloading the page or try again later.',
  iconFallbackText: 'Warning',
  attributes: { 'data-qa': 'no-assessment-data-warning' },
})

// -------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------
// Helpers to create accordion starts

// Badges shown in the accordion header (RoSH and/or Reoffending flags)
const accordionHeaderBadges = Format(
  '%1%2',
  when(Item().path('linkedToHarm').match(Condition.Equals('YES')))
    .then('<span class="moj-badge moj-badge--large moj-badge--purple">RoSH (Risk of Serious Harm)</span>')
    .else(''),
  when(Item().path('linkedToReoffending').match(Condition.Equals('YES')))
    .then('<span class="moj-badge moj-badge--large moj-badge--bright-purple">Risk of reoffending</span>')
    .else(''),
)

// Creates accordion items for a section's areas.
// Each item contains the AssessmentInfoDetails component which displays
// assessment data and score section (when showAsDetails is false).
// @param dataKey: the data key for the collection, for example 'highScoringAreas'
const createAccordionItems = (dataKey: string) =>
  Data(dataKey).each(
    Iterator.Map({
      heading: {
        html: Format(
          '%1 <span class="about-page-accordion-header-badges">%2</span>',
          Item().path('title'),
          accordionHeaderBadges,
        ),
      },
      content: {
        blocks: [
          AssessmentInfoDetails({
            personName: CaseData.Forename,
            areaName: Item().path('title'),
            assessmentData: Item().value(),
            status: Data('allAreasAssessmentStatus'),
            showAsDetails: false,
            fullWidth: true,
          }),
          HtmlBlock({
            content: Format(
              `<p class="add-goal-link"><a href="goal/new/add-goal/%1">Create %2 goal</a></p>`,
              Item().path('goalRoute'),
              Item().path('title').pipe(Transformer.String.ToLowerCase()),
            ),
          }),
        ],
      },
    }),
  )

// Creates a GovUKAccordion component with dynamic items from a data collection.
// dataKey: the data key for the collection, for example 'highScoringAreas' etc
// accordionId: unique ID for the accordion element
// Hidden when assessment data failed to load OR when there are no items in the collection
const createAccordion = (dataKey: string, accordionId: string) =>
  GovUKAccordion({
    hidden: or(
      isAssessmentError,
      isSentenceInformationAndAssessmentLoadingError,
      not(Data(dataKey).match(Condition.IsRequired())),
    ),
    id: accordionId,
    classes: 'about-page-accordion',
    rememberExpanded: false,
    items: createAccordionItems(dataKey),
  })
// -------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------
// Helpers to create accordion ends

// -------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------
// Area Sections starts

// Creates fallback text when a section has no areas:
// - if assessment incomplete: "No {sectionName} at the moment."
// - if assessment complete: "No {sectionName}."
// Hidden when assessment data failed to load OR when there are items in the collection
const createEmptyFallback = (dataKey: string, sectionName: string) =>
  HtmlBlock({
    hidden: or(
      isAssessmentError,
      isSentenceInformationAndAssessmentLoadingError,
      Data(dataKey).match(Condition.IsRequired()),
    ),
    content: when(Data('isAssessmentComplete').match(Condition.Equals(true)))
      .then(`<p class="govuk-body">No ${sectionName}.</p>`)
      .else(`<p class="govuk-body">No ${sectionName} at the moment.</p>`),
  })

// Incomplete Areas:
// only shown when there are incomplete areas, hidden on assessment error
export const incompleteAreasHeading = HtmlBlock({
  hidden: or(
    isAssessmentError,
    isSentenceInformationAndAssessmentLoadingError,
    not(Data('incompleteAreas').match(Condition.IsRequired())),
  ),
  content: `<h2 class="govuk-heading-m govuk-!-margin-top-6">Incomplete areas</h2>
    <p class="govuk-body">These areas have not been marked as complete in the assessment yet, but you can see the latest information available.</p>`,
})
export const incompleteAreasAccordion = createAccordion('incompleteAreas', 'incomplete-areas-accordion')

// High-scoring Areas:
// always shown with fallback text when empty, hidden on assessment error
export const highScoringAreasHeading = HtmlBlock({
  hidden: or(isSentenceInformationAndAssessmentLoadingError, isAssessmentError),
  content: '<h2 class="govuk-heading-m govuk-!-margin-top-6">High-scoring areas from the assessment</h2>',
})
export const highScoringAreasAccordion = [
  createAccordion('highScoringAreas', 'high-scoring-areas-accordion'),
  createEmptyFallback('highScoringAreas', 'high-scoring areas'),
]

// Low-scoring Areas:
// always shown with fallback text when empty, hidden on assessment error
export const lowScoringAreasHeading = HtmlBlock({
  hidden: or(isSentenceInformationAndAssessmentLoadingError, isAssessmentError),
  content: '<h2 class="govuk-heading-m govuk-!-margin-top-6">Low-scoring areas from the assessment</h2>',
})
export const lowScoringAreasAccordion = [
  createAccordion('lowScoringAreas', 'low-scoring-areas-accordion'),
  createEmptyFallback('lowScoringAreas', 'low-scoring areas'),
]

// Other Areas (no scores):
// Finance and Health and Wellbeing when marked as Complete (else under Incomplete), hidden on assessment error
export const otherAreasHeading = HtmlBlock({
  hidden: or(isSentenceInformationAndAssessmentLoadingError, isAssessmentError),
  content: `<h2 class="govuk-heading-m govuk-!-margin-top-6">Areas without a need score</h2>
    <p class="govuk-body">Health and wellbeing, and finances never have a need score. When other information is available for those areas, you can see it here.</p>`,
})
export const otherAreasAccordion = createAccordion('otherAreas', 'other-areas-accordion')

// -------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------
// Area Sections ends
