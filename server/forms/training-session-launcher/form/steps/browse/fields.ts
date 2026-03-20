import { block, Data, Format, Item, Iterator, when } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { HtmlBlock, TemplateWrapper } from '@form-engine/registry/components'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { GovUKButton, GovUKDetails, GovUKLinkButton } from '@form-engine-govuk-components/components'
import { MOJAlert } from '@form-engine-moj-components/components'
import { TabPanel } from '../../../components'
import { scenarioDetailsBlock } from '../../blocks/scenarioDetailsBlock'

/**
 * Notification banners - renders any flash notifications from session using MOJ Alert
 */
export const notificationBanners = CollectionBlock({
  collection: Data('notifications').each(
    Iterator.Map(
      MOJAlert({
        alertVariant: Item().path('type'),
        title: Item().path('title'),
        text: Item().path('message'),
        showTitleAsHeading: true,
      }),
    ),
  ),
})

/**
 * Page heading with caption
 */
export const pageHeading = block<HtmlBlock>({
  variant: 'html',
  content: `
    <span class="govuk-caption-l">Training</span>
    <h1 class="govuk-heading-l">Select a scenario</h1>
  `,
})

/**
 * Help text explaining what this page is for
 */
export const pageHelpText = GovUKDetails({
  summaryText: 'What is this page for?',
  content: [
    HtmlBlock({
      content: `
        <p class="govuk-body">
          This page allows you to select a pre-configured training scenario to practice assessments.
          Each scenario represents a different case study with realistic data.
        </p>
        <p class="govuk-body">
          Choose a scenario from the list on the left, review the details, then click
          <strong>Start session</strong> to begin. Your session will be added to your active sessions list.
        </p>
      `,
    }),
  ],
})

/**
 * Panel content template for each scenario
 * Uses Item() references to access the current scenario's data
 */
const scenarioPanelContent = [
  // Header with title, description, and launch controls
  TemplateWrapper({
    template: `
      <header class="scenario-picker__panel-header">
        <h2 class="govuk-heading-m scenario-picker__panel-title">{{title}}</h2>
        <p class="govuk-body">{{description}}</p>
        <div class="scenario-picker__launch-controls">
          <form method="post" novalidate class="scenario-picker__launch-form">
            <input type="hidden" name="_csrf" value="{{csrfToken}}">
            <input type="hidden" name="scenarioId" value="{{scenarioId}}">
            <input type="hidden" name="seed" value="{{seed}}">
            {{slot:formControls}}
          </form>
          {{slot:linkButtons}}
          <form method="post" novalidate style="{{deleteFormStyle}}">
            <input type="hidden" name="_csrf" value="{{csrfToken}}">
            <input type="hidden" name="scenarioId" value="{{scenarioId}}">
            {{slot:deleteButton}}
          </form>
        </div>
      </header>
    `,
    values: {
      csrfToken: Data('csrfToken'),
      title: Item().path('name'),
      description: Item().path('description'),
      scenarioId: Item().path('id'),
      seed: Item().path('rawScenario.seed'),
      deleteFormStyle: when(Item().path('isCustom').match(Condition.Equals(true)))
        .then('')
        .else('display:none'),
    },
    slots: {
      formControls: [
        GovUKButton({
          text: 'Start session',
          id: Format('start-session-%1', Item().path('id')),
        }),
      ],
      deleteButton: [
        GovUKButton({
          text: 'Delete scenario',
          name: 'action',
          value: 'deleteScenario',
          classes: 'govuk-button--warning',
          id: Format('delete-scenario-%1', Item().path('id')),
        }),
      ],
      linkButtons: [
        GovUKLinkButton({
          text: 'Customize scenario',
          id: Format('customize-scenario-%1', Item().path('id')),
          classes: 'govuk-button--secondary',
          href: Format('customise?scenario=%1', Item().path('id')),
          attributes: { tabindex: '0' },
        }),

        GovUKLinkButton({
          html: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="117.15 272.36 365.63 367.74" fill="currentColor" aria-hidden="true"><path d="m328.73 272.36c-1.0593-0.0232-2.2036 0.23919-3.6546 0.73073l-160.8 47.216c-1.338 0.31267-1.2603 0.67334-0.14622 1.5349l142.74 113.95c2.6283 2.179 3.8646 2.4492 7.5282 1.3156l160.06-55.474c3.6722-1.3494 3.9274-1.6778 0.14636-4.1662l-140.48-102.76c-2.1688-1.5284-3.6434-2.3048-5.4085-2.3387zm-18.345 13.814c3.2021-0.0232 6.5824 0.32827 10.086 1.0963 14.016 3.073 23.956 11.638 22.146 19.076-1.8102 7.4379-14.635 10.967-28.651 7.8935-14.016-3.0731-23.956-11.565-22.146-19.003 1.3576-5.5786 8.9586-9.0156 18.564-9.063zm-90.63 27.555c3.2021-0.0232 6.6554 0.32813 10.159 1.0964 14.016 3.073 23.883 11.565 22.073 19.003-1.8102 7.4381-14.635 11.04-28.651 7.9667-14.016-3.073-23.883-11.638-22.073-19.076 1.3577-5.5786 8.8855-8.9426 18.491-8.99zm137.33 7.0164c3.202-0.0232 6.6555 0.40133 10.159 1.1695 14.016 3.0728 23.883 11.565 22.073 19.003-1.8102 7.438-14.635 10.967-28.651 7.8935-14.016-3.0729-23.883-11.565-22.073-19.003 1.3577-5.5783 8.8855-9.0156 18.492-9.063zm-202.89 8.8438c-0.2935 0.0748-0.38831 0.53334-0.58471 1.4619l-36.252 181.33c-0.42235 1.8862-0.3482 2.3536 1.3887 3.8739l137.7 118.7c3.2029 3.0612 3.8757 3.0218 4.3122-0.73091l40.126-183.89c0.84081-2.5054-0.0249-3.8837-1.4618-5.0432l-143.77-114.81c-0.74001-0.62428-1.1682-0.95149-1.4618-0.87718zm111.83 20.684c3.202-0.0232 6.6554 0.32815 10.159 1.0965 14.016 3.073 23.883 11.565 22.073 19.003-1.8102 7.4381-14.635 10.967-28.651 7.8937-14.016-3.073-23.883-11.565-22.073-19.003 1.3576-5.5787 8.8856-8.9426 18.491-8.9901zm138.8 6.0664c3.202-0.0232 6.6554 0.32815 10.159 1.0963 14.016 3.0731 23.883 11.565 22.073 19.003-1.8102 7.4381-14.635 11.04-28.651 7.9668-14.016-3.0731-23.883-11.638-22.073-19.076 1.3577-5.5783 8.8856-8.9423 18.492-8.9899zm-241.71 6.651c0.54012-0.0537 1.1314-0.0294 1.681 0 6.5957 0.3492 13.738 6.5306 17.907 16.445 5.5583 13.219 3.7052 28.055-4.093 33.109-7.7982 5.0539-18.634-1.5446-24.192-14.764-5.5583-13.219-3.7054-28.055 4.093-33.109 1.4621-0.94771 2.9845-1.5207 4.6046-1.6812zm150.64 23.827c3.202-0.0231 6.6554 0.32816 10.159 1.0965 14.016 3.0728 23.883 11.565 22.073 19.003-1.8103 7.438-14.635 10.967-28.651 7.8936-14.016-3.0731-23.883-11.565-22.073-19.003 1.3576-5.5785 8.8855-8.9425 18.491-8.99zm168.18 5.0431c-0.30728 0.0632-0.73942 0.17087-1.2425 0.36543l-164.38 57.02c-3.348 1.3784-3.2476 1.9411-3.8007 4.4584l-40.053 183.31c-0.13597 2.6988-1.1302 3.9269 2.0465 2.4852l161.97-60.518c3.1428-1.5036 3.7452-1.7677 4.093-4.8238l42.026-180.75c0.34821-1.2733 0.26378-1.7272-0.65777-1.5348zm-26.677 29.747c4.6284 0.0748 8.2604 2.3262 9.8671 6.6512 3.2131 8.6497-2.9745 22.494-13.887 30.916-10.912 8.4224-22.368 8.2114-25.581-0.43849-3.2134-8.6498 2.9744-22.494 13.887-30.917 5.4562-4.2113 11.086-6.2873 15.714-6.2127zm-199.24 15.86c6.6789 0.17076 13.965 6.4487 18.199 16.518 5.5583 13.219 3.7783 28.055-4.0199 33.109s-18.634-1.6175-24.192-14.837c-5.5583-13.219-3.7054-27.982 4.093-33.036 1.4622-0.94772 2.9841-1.5209 4.6046-1.6812 0.43892-0.0453 0.87044-0.0842 1.3156-0.0726zm-58.69 21.196c6.6788 0.17077 13.965 6.4488 18.199 16.518 5.5583 13.219 3.7783 28.055-4.0199 33.109s-18.634-1.6176-24.192-14.837c-5.5583-13.219-3.7052-27.982 4.093-33.036 1.4621-0.94772 2.9841-1.521 4.6045-1.6812 0.43892-0.0453 0.87046-0.0842 1.3157-0.0726zm-57.813 20.976c0.53992-0.0537 1.1313-0.0273 1.6809 0 6.5957 0.3492 13.665 6.6037 17.834 16.518 5.5583 13.219 3.7784 27.982-4.0198 33.036-7.7983 5.054-18.634-1.5446-24.192-14.764-5.5583-13.219-3.7053-28.055 4.093-33.109 1.4622-0.94772 2.9845-1.5208 4.6046-1.6812zm254.06 17.541c4.529 0.1474 8.1393 2.3938 9.7208 6.6512 3.2134 8.6498-3.0476 22.494-13.96 30.916-10.912 8.4224-22.368 8.2115-25.581-0.43849-3.2134-8.6497 3.0476-22.494 13.96-30.916 4.7742-3.6848 9.6414-5.7376 13.887-6.1395 0.68233-0.0653 1.3264-0.0937 1.9734-0.0726zm-164.23 58.691c0.54-0.0537 1.1313-0.0273 1.681 0 6.5956 0.34922 13.738 6.5305 17.907 16.445 5.5583 13.219 3.7053 28.055-4.093 33.109-7.7982 5.054-18.561-1.5446-24.119-14.764-5.5583-13.219-3.7784-28.055 4.0198-33.109 1.4622-0.94739 2.9845-1.5206 4.6046-1.6809zm97.281 19.003c4.6285 0.0748 8.2603 2.2531 9.867 6.578 3.2132 8.6497-2.9744 22.494-13.887 30.916-10.912 8.4224-22.368 8.2844-25.581-0.36546-3.2132-8.6496 2.9744-22.494 13.887-30.917 5.4562-4.2111 11.086-6.287 15.714-6.2123z"/></svg> Randomize<span class="govuk-visually-hidden">Randomize</span>',
          id: Format('randomize-scenario-%1', Item().path('id')),
          classes: 'govuk-button--alternative-blue',
          href: Format('browse?scenario=%1', Item().path('id')),
          attributes: { tabindex: '0' },
        }),
      ],
    },
  }),

  // Scenario details heading
  HtmlBlock({
    content: '<h2 class="govuk-heading-m">Scenario Details</h2>',
  }),

  // Scenario details - uses the shared scenarioDetailsBlock
  scenarioDetailsBlock,
]

/**
 * Scenario picker TabPanel
 * Uses Data('scenarios') loaded via onLoad effect
 * Query param 'scenario' syncs selected tab with URL
 */
export const scenarioPickerPanel = TabPanel({
  id: 'scenario-picker',
  sidebarTitle: 'Scenarios',
  defaultSelected: 'default',
  queryParam: 'scenario',
  items: Data('scenarios').each(
    Iterator.Map({
      id: Item().path('id'),
      label: Item().path('name'),
      sublabel: Item().path('shortDescription'),
      panel: scenarioPanelContent,
    }),
  ),
})
