import { toKebabCase } from '../../server/utils/dataTag'

// MOJ does not provide attributes for its generated date-picker and alert buttons.
const MOJ_CONTROL_TAGS = [
  ['.moj-js-datepicker-toggle', 'goal-target-date-open-calendar-button'],
  ['.moj-js-datepicker-prev-year', 'goal-target-date-previous-year-button'],
  ['.moj-js-datepicker-prev-month', 'goal-target-date-previous-month-button'],
  ['.moj-js-datepicker-next-month', 'goal-target-date-next-month-button'],
  ['.moj-js-datepicker-next-year', 'goal-target-date-next-year-button'],
  ['.moj-datepicker__calendar button', 'goal-target-date-day-button'],
  ['.moj-js-datepicker-ok', 'goal-target-date-select-button'],
  ['.moj-js-datepicker-cancel', 'goal-target-date-close-button'],
  ['.moj-alert__dismiss', 'notification-dismiss-button'],
]

const TRACKED_CHOICE_VALUES = new Set([
  'yes',
  'no',
  'confirmed',
  'could_not_answer',
  'date_in_3_months',
  'date_in_6_months',
  'date_in_12_months',
  'set_another_date',
  'accommodation',
  'employment-and-education',
  'finances',
  'drug-use',
  'alcohol-use',
  'health-and-wellbeing',
  'personal-relationships-and-community',
  'thinking-behaviours-and-attitudes',
  'lifestyle-and-associates',
])

// A new node may match the selector itself, so include it with its descendants.
const findElements = (root, selector) => [
  ...(root.matches?.(selector) ? [root] : []),
  ...(root.querySelectorAll?.(selector) ?? []),
]

const copyDataTagFromParent = element => {
  const dataTag = element.parentElement?.getAttribute('data-ai-id')
  if (dataTag) element.setAttribute('data-ai-id', dataTag)
}

const addChoiceInputDataTag = input => {
  // Unknown values stay untagged so the audit requires an explicit, reviewed tag.
  if (!TRACKED_CHOICE_VALUES.has(input.value)) return

  const dataTag = [input.name, input.value, input.type].map(toKebabCase).filter(Boolean).join('-')
  if (dataTag) input.setAttribute('data-ai-id', dataTag)
}

const updateDataTagBeforeCapture = (element, updateDataTag) => {
  updateDataTag()
  element.addEventListener('mousedown', updateDataTag)
  element.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') updateDataTag()
  })
}

const initAboutAccordionDataTags = () => {
  document.querySelectorAll('.about-page-accordion .govuk-accordion__show-all').forEach(button => {
    const accordionId = button.closest('.govuk-accordion')?.id
    if (!accordionId) return

    updateDataTagBeforeCapture(button, () => {
      const action = button.getAttribute('aria-expanded') === 'true' ? 'collapse-all' : 'expand-all'
      button.setAttribute('data-ai-id', `san-info-${accordionId}-${action}-button`)
    })
  })

  document.querySelectorAll('.about-page-accordion .govuk-accordion__section').forEach((section, index) => {
    const button = section.querySelector('.govuk-accordion__section-button')
    const accordionId = section.closest('.govuk-accordion')?.id
    if (!button || !accordionId) return

    const href = section.querySelector('.add-goal-link a')?.getAttribute('href')
    const routeArea = href?.split('/').filter(Boolean).at(-1)
    const area = TRACKED_CHOICE_VALUES.has(routeArea) ? routeArea : `item-${index + 1}`

    updateDataTagBeforeCapture(button, () => {
      const action = button.getAttribute('aria-expanded') === 'true' ? 'collapse' : 'expand'
      button.setAttribute('data-ai-id', `san-info-${accordionId}-${area}-${index + 1}-${action}-button`)
    })
  })
}

const initGoalAchievementNoteDataTag = () => {
  const form = document.querySelector('input[name="has_achieved_goal"]')?.closest('form')
  const button = form?.querySelector('[data-ai-id="confirm-if-achieved-save-and-continue-button"]')
  if (!form || !button) return

  updateDataTagBeforeCapture(button, () => {
    const yesSelected = form.querySelector('input[name="has_achieved_goal"][value="yes"]')?.checked
    if (!yesSelected) {
      button.setAttribute('data-ai-id', 'confirm-if-achieved-save-and-continue-button')
      return
    }

    const noteAdded = Boolean(form.querySelector('textarea[name="how_helped"]')?.value.trim())
    const noteTag = noteAdded ? 'note-added' : 'note-not-added'
    button.setAttribute('data-ai-id', `confirm-if-achieved-save-and-continue-${noteTag}-button`)
  })
}

const applyComponentDataTags = root => {
  MOJ_CONTROL_TAGS.forEach(([selector, dataTag]) => {
    findElements(root, selector).forEach(element => element.setAttribute('data-ai-id', dataTag))
  })

  // MOJ puts item attributes on the <li>; analytics needs them on the clicked link.
  const sideNavigationLinkSelector = '[data-qa="area-of-need-nav"] li[data-ai-id] > a:not([data-ai-id])'
  findElements(root, sideNavigationLinkSelector).forEach(copyDataTagFromParent)

  const accordionSelector = '.govuk-accordion__show-all, .govuk-accordion__section-button'
  findElements(root, accordionSelector).forEach(button => {
    const accordionId = button.closest('.govuk-accordion')?.id
    const controlledContentId = button.getAttribute('aria-controls')

    if (controlledContentId) {
      button.setAttribute('data-ai-id', `${controlledContentId}-button`)
    } else if (accordionId) {
      button.setAttribute('data-ai-id', `${accordionId}-show-all-button`)
    }
  })

  findElements(root, 'details[data-ai-id] > summary:not([data-ai-id])').forEach(copyDataTagFromParent)

  const choiceInputSelector = 'input[type="radio"]:not([data-ai-id]), input[type="checkbox"]:not([data-ai-id])'
  findElements(root, choiceInputSelector).forEach(addChoiceInputDataTag)

  findElements(root, 'input[name="confirm_privacy"]').forEach(input => {
    const confirmButton = input.closest('form')?.querySelector('button[name="action"][value="confirm"]')
    confirmButton?.setAttribute('data-ai-id', 'privacy-action-confirm-button')
  })

  findElements(root, '.govuk-error-summary__list a:not([data-ai-id])').forEach((link, index) => {
    const fieldCode = toKebabCase(link.getAttribute('href')?.replace(/^#/, '') || '') || `validation-${index + 1}`
    link.setAttribute('data-ai-id', `${fieldCode}-error-summary-link`)
  })
}

export const initComponentDataTags = () => {
  if (!window.location.pathname.startsWith('/sentence-plan/')) return

  applyComponentDataTags(document)
  initAboutAccordionDataTags()
  initGoalAchievementNoteDataTag()

  new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => applyComponentDataTags(node))
    })
  }).observe(document.body, { childList: true, subtree: true })
}
