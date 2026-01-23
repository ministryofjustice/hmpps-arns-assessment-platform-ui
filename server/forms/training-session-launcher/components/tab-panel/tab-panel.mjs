/**
 * TabPanel Web Component
 *
 * A two-column tab panel with accessible keyboard navigation.
 * Based on GOV.UK tabs accessibility patterns.
 *
 * @example
 * <div data-module="tab-panel" id="my-panel">
 *   <button role="tab" data-panel-id="panel-1">Tab 1</button>
 *   <section id="my-panel-panel-panel-1" role="tabpanel">Content 1</section>
 * </div>
 */
export class TabPanel extends HTMLElement {
  static moduleName = 'tab-panel'

  /** @type {NodeListOf<HTMLButtonElement>} */
  #tabs

  /** @type {NodeListOf<HTMLElement>} */
  #panels

  /** @type {string} */
  #hiddenClass = 'tab-panel__panel--active'

  /** @type {string} */
  #selectedClass = 'tab-panel__item-btn--selected'

  connectedCallback() {
    this.#tabs = this.querySelectorAll('[role="tab"]')
    this.#panels = this.querySelectorAll('[role="tabpanel"]')

    if (!this.#tabs.length || !this.#panels.length) {
      console.warn('TabPanel: No tabs or panels found')
      return
    }

    this.#setup()
  }

  disconnectedCallback() {
    this.#teardown()
  }

  #setup() {
    // Set up ARIA attributes and event listeners
    this.#tabs.forEach((tab, index) => {
      tab.setAttribute('tabindex', index === 0 ? '0' : '-1')
      tab.addEventListener('click', this.#onTabClick)
      tab.addEventListener('keydown', this.#onTabKeydown)
    })

    // Ensure correct initial state
    const selectedTab = this.querySelector('[aria-selected="true"]') || this.#tabs[0]

    if (selectedTab) {
      this.#showTab(selectedTab)
    }
  }

  #teardown() {
    this.#tabs.forEach(tab => {
      tab.removeEventListener('click', this.#onTabClick)
      tab.removeEventListener('keydown', this.#onTabKeydown)
    })
  }

  /**
   * Handle tab click
   * @param {Event} event
   */
  #onTabClick = event => {
    event.preventDefault()
    const tab = event.currentTarget

    if (!(tab instanceof HTMLElement)) {
      return
    }

    const currentTab = this.#getCurrentTab()

    if (currentTab && currentTab !== tab) {
      this.#hideTab(currentTab)
    }

    this.#showTab(tab)
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event
   */
  #onTabKeydown = event => {
    const currentTab = event.currentTarget

    if (!(currentTab instanceof HTMLElement)) {
      return
    }

    switch (event.key) {
      case 'ArrowLeft':
      case 'Left':
        event.preventDefault()
        this.#activatePreviousTab(currentTab)
        break

      case 'ArrowRight':
      case 'Right':
        event.preventDefault()
        this.#activateNextTab(currentTab)
        break

      case 'ArrowUp':
      case 'Up':
        event.preventDefault()
        this.#activatePreviousTab(currentTab)
        break

      case 'ArrowDown':
      case 'Down':
        event.preventDefault()
        this.#activateNextTab(currentTab)
        break

      case 'Home':
        event.preventDefault()
        this.#activateFirstTab(currentTab)
        break

      case 'End':
        event.preventDefault()
        this.#activateLastTab(currentTab)
        break
    }
  }

  /**
   * Get the currently selected tab
   * @returns {HTMLElement | null}
   */
  #getCurrentTab() {
    return this.querySelector('[aria-selected="true"]')
  }

  /**
   * Get the panel associated with a tab
   * @param {HTMLElement} tab
   * @returns {HTMLElement | null}
   */
  #getPanel(tab) {
    const panelId = tab.getAttribute('aria-controls')

    if (!panelId) {
      return null
    }

    return this.querySelector(`#${panelId}`)
  }

  /**
   * Show a tab and its panel
   * @param {HTMLElement} tab
   */
  #showTab(tab) {
    tab.setAttribute('aria-selected', 'true')
    tab.setAttribute('tabindex', '0')
    tab.classList.add(this.#selectedClass)

    const panel = this.#getPanel(tab)

    if (panel) {
      panel.removeAttribute('hidden')
      panel.classList.add(this.#hiddenClass)
    }
  }

  /**
   * Hide a tab and its panel
   * @param {HTMLElement} tab
   */
  #hideTab(tab) {
    tab.setAttribute('aria-selected', 'false')
    tab.setAttribute('tabindex', '-1')
    tab.classList.remove(this.#selectedClass)

    const panel = this.#getPanel(tab)

    if (panel) {
      panel.setAttribute('hidden', '')
      panel.classList.remove(this.#hiddenClass)
    }
  }

  /**
   * Get tab index in the tabs list
   * @param {HTMLElement} tab
   * @returns {number}
   */
  #getTabIndex(tab) {
    return Array.from(this.#tabs).indexOf(tab)
  }

  /**
   * Activate the previous tab
   * @param {HTMLElement} currentTab
   */
  #activatePreviousTab(currentTab) {
    const currentIndex = this.#getTabIndex(currentTab)
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : this.#tabs.length - 1
    const previousTab = this.#tabs[previousIndex]

    this.#hideTab(currentTab)
    this.#showTab(previousTab)
    previousTab.focus()
  }

  /**
   * Activate the next tab
   * @param {HTMLElement} currentTab
   */
  #activateNextTab(currentTab) {
    const currentIndex = this.#getTabIndex(currentTab)
    const nextIndex = currentIndex < this.#tabs.length - 1 ? currentIndex + 1 : 0
    const nextTab = this.#tabs[nextIndex]

    this.#hideTab(currentTab)
    this.#showTab(nextTab)
    nextTab.focus()
  }

  /**
   * Activate the first tab
   * @param {HTMLElement} currentTab
   */
  #activateFirstTab(currentTab) {
    const firstTab = this.#tabs[0]

    if (firstTab !== currentTab) {
      this.#hideTab(currentTab)
      this.#showTab(firstTab)
      firstTab.focus()
    }
  }

  /**
   * Activate the last tab
   * @param {HTMLElement} currentTab
   */
  #activateLastTab(currentTab) {
    const lastTab = this.#tabs[this.#tabs.length - 1]

    if (lastTab !== currentTab) {
      this.#hideTab(currentTab)
      this.#showTab(lastTab)
      lastTab.focus()
    }
  }
}

/**
 * Initialize TabPanel components using data-module attribute
 * (for compatibility with existing GOV.UK patterns)
 */
export function initTabPanels() {
  const panels = document.querySelectorAll('[data-module="tab-panel"]')

  panels.forEach(panel => {
    // Create instance and attach methods to the element
    const instance = new TabPanelController(panel)
    instance.init()
  })
}

/**
 * Controller class for non-custom-element usage
 * (works with data-module="tab-panel" pattern)
 */
export class TabPanelController {
  #element
  #tabs
  #panels
  #hiddenClass = 'tab-panel__panel--active'
  #selectedClass = 'tab-panel__item-btn--selected'
  #queryParam = null

  /**
   * @param {HTMLElement} element
   */
  constructor(element) {
    this.#element = element
    this.#tabs = element.querySelectorAll('[role="tab"]')
    this.#panels = element.querySelectorAll('[role="tabpanel"]')
    this.#queryParam = element.getAttribute('data-query-param')
  }

  init() {
    if (!this.#tabs.length || !this.#panels.length) {
      console.warn('TabPanel: No tabs or panels found')
      return
    }

    this.#tabs.forEach(tab => {
      const isSelected = tab.getAttribute('aria-selected') === 'true'
      tab.setAttribute('tabindex', isSelected ? '0' : '-1')
      tab.addEventListener('click', this.#onTabClick)
      tab.addEventListener('keydown', this.#onTabKeydown)
    })

    // If queryParam is configured, check URL for initial selection
    if (this.#queryParam) {
      const urlParams = new URLSearchParams(window.location.search)
      const selectedFromUrl = urlParams.get(this.#queryParam)

      if (selectedFromUrl) {
        const tabToSelect = this.#findTabByPanelId(selectedFromUrl)

        if (tabToSelect) {
          const currentTab = this.#getCurrentTab()

          if (currentTab && currentTab !== tabToSelect) {
            this.#hideTab(currentTab)
          }

          this.#showTab(tabToSelect, false) // Don't update URL on init
        }
      }
    }
  }

  /**
   * Find a tab by its panel ID
   * @param {string} panelId
   * @returns {HTMLElement | null}
   */
  #findTabByPanelId(panelId) {
    return this.#element.querySelector(`[data-panel-id="${panelId}"]`)
  }

  destroy() {
    this.#tabs.forEach(tab => {
      tab.removeEventListener('click', this.#onTabClick)
      tab.removeEventListener('keydown', this.#onTabKeydown)
    })
  }

  #onTabClick = event => {
    event.preventDefault()
    const tab = event.currentTarget

    if (!(tab instanceof HTMLElement)) {
      return
    }

    const currentTab = this.#getCurrentTab()

    if (currentTab && currentTab !== tab) {
      this.#hideTab(currentTab)
    }

    this.#showTab(tab)
  }

  #onTabKeydown = event => {
    const currentTab = event.currentTarget

    if (!(currentTab instanceof HTMLElement)) {
      return
    }

    switch (event.key) {
      case 'ArrowLeft':
      case 'Left':
      case 'ArrowUp':
      case 'Up':
        event.preventDefault()
        this.#activateAdjacentTab(currentTab, -1)
        break

      case 'ArrowRight':
      case 'Right':
      case 'ArrowDown':
      case 'Down':
        event.preventDefault()
        this.#activateAdjacentTab(currentTab, 1)
        break

      case 'Home':
        event.preventDefault()
        this.#activateTabByIndex(currentTab, 0)
        break

      case 'End':
        event.preventDefault()
        this.#activateTabByIndex(currentTab, this.#tabs.length - 1)
        break
    }
  }

  #getCurrentTab() {
    return this.#element.querySelector('[aria-selected="true"]')
  }

  #getPanel(tab) {
    const panelId = tab.getAttribute('aria-controls')
    return panelId ? this.#element.querySelector(`#${panelId}`) : null
  }

  /**
   * Show a tab and its panel
   * @param {HTMLElement} tab
   * @param {boolean} updateUrl - Whether to update the URL query param (default: true)
   */
  #showTab(tab, updateUrl = true) {
    tab.setAttribute('aria-selected', 'true')
    tab.setAttribute('tabindex', '0')
    tab.classList.add(this.#selectedClass)

    const panel = this.#getPanel(tab)

    if (panel) {
      panel.removeAttribute('hidden')
      panel.classList.add(this.#hiddenClass)
    }

    // Update URL query param if configured
    const panelId = tab.getAttribute('data-panel-id')

    if (updateUrl && this.#queryParam && panelId) {
      const url = new URL(window.location.href)
      url.searchParams.set(this.#queryParam, panelId)
      window.history.replaceState({}, '', url)
    }
  }

  #hideTab(tab) {
    tab.setAttribute('aria-selected', 'false')
    tab.setAttribute('tabindex', '-1')
    tab.classList.remove(this.#selectedClass)

    const panel = this.#getPanel(tab)

    if (panel) {
      panel.setAttribute('hidden', '')
      panel.classList.remove(this.#hiddenClass)
    }
  }

  #activateAdjacentTab(currentTab, direction) {
    const tabs = Array.from(this.#tabs)
    const currentIndex = tabs.indexOf(currentTab)
    let nextIndex = currentIndex + direction

    if (nextIndex < 0) {
      nextIndex = tabs.length - 1
    } else if (nextIndex >= tabs.length) {
      nextIndex = 0
    }

    const nextTab = tabs[nextIndex]
    this.#hideTab(currentTab)
    this.#showTab(nextTab)
    nextTab.focus()
  }

  #activateTabByIndex(currentTab, index) {
    const tabs = Array.from(this.#tabs)
    const targetTab = tabs[index]

    if (targetTab && targetTab !== currentTab) {
      this.#hideTab(currentTab)
      this.#showTab(targetTab)
      targetTab.focus()
    }
  }
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTabPanels)
} else {
  initTabPanels()
}
