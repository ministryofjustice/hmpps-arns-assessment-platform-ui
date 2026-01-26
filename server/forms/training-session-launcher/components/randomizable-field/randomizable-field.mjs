/**
 * RandomizableField web component
 *
 * Wraps a form field with a randomization toggle.
 * - For text/select fields: Uses a checkbox suffix
 * - For radio fields: Adds a "Random" option to the radio group
 */
class RandomizableFieldWrapper extends HTMLElement {
  constructor() {
    super()

    if (this.dataset.initialized) {
      return
    }

    this.dataset.initialized = 'true'
    this.fieldType = this.dataset.fieldType || 'text'
    this.hiddenInput = this.querySelector('.randomizable-field__hidden')

    if (!this.hiddenInput) {
      console.warn('randomizable-field: missing hidden input', this)

      return
    }

    if (this.fieldType === 'radio') {
      this.setupRadioMode()
    } else {
      this.setupTextMode()
    }
  }

  /**
   * Setup for text/select fields with checkbox suffix
   */
  setupTextMode() {
    this.checkbox = this.querySelector('.randomizable-field__checkbox')
    this.suffix = this.querySelector('.randomizable-field__suffix')
    this.fieldInput = this.querySelector(
      '.govuk-input, .govuk-select, .govuk-textarea',
    )

    if (!this.checkbox || !this.suffix) {
      console.warn('randomizable-field: missing required elements for text mode', this)

      return
    }

    this.repositionSuffix()
    this.checkbox.addEventListener('change', () => this.updateTextFieldState())
    this.updateTextFieldState()
  }

  /**
   * Setup for radio fields with "Random" option
   */
  setupRadioMode() {
    const radiosContainer = this.querySelector('.govuk-radios')

    if (!radiosContainer) {
      console.warn('randomizable-field: missing govuk-radios container', this)

      return
    }

    // Create and append the Random option
    this.createRandomOption(radiosContainer)

    // Now find all radio inputs including our new one
    this.radioInputs = this.querySelectorAll('.govuk-radios__input')
    this.randomOption = this.querySelector('[data-randomize-option="true"]')

    if (!this.randomOption) {
      console.warn('randomizable-field: failed to create random option', this)

      return
    }

    // Listen for changes on all radio inputs
    this.radioInputs.forEach(radio => {
      radio.addEventListener('change', () => this.updateRadioFieldState())
    })

    // Set initial state - if randomized, check the Random option
    if (this.dataset.randomized === 'true') {
      this.randomOption.checked = true
    }

    this.updateRadioFieldState()
  }

  /**
   * Create the "Random" option element and append to the radios container
   */
  createRandomOption(container) {
    const fieldCode = this.dataset.fieldCode || 'field'
    const label = this.dataset.randomizeLabel || 'Random'
    const fieldLabel = this.dataset.fieldLabel || fieldCode
    const radioId = `${fieldCode}-random`

    const itemDiv = document.createElement('div')
    itemDiv.className = 'govuk-radios__item randomizable-field__random-option'

    const input = document.createElement('input')
    input.className = 'govuk-radios__input'
    input.type = 'radio'
    input.id = radioId
    input.name = fieldCode
    input.value = '__RANDOM__'
    input.dataset.randomizeOption = 'true'
    input.setAttribute('aria-label', `Randomize ${fieldLabel.toLowerCase()}`)

    const labelEl = document.createElement('label')
    labelEl.className = 'govuk-label govuk-radios__label'
    labelEl.htmlFor = radioId
    labelEl.textContent = label

    itemDiv.appendChild(input)
    itemDiv.appendChild(labelEl)
    container.appendChild(itemDiv)
  }

  repositionSuffix() {
    if (!this.fieldInput || !this.suffix) {
      return
    }

    // Create a wrapper div for the input + suffix
    const inputWrapper = document.createElement('div')
    inputWrapper.className = 'randomizable-field__inline-group'

    // Insert wrapper before the input
    this.fieldInput.parentNode.insertBefore(inputWrapper, this.fieldInput)

    // Move input and suffix into the wrapper
    inputWrapper.appendChild(this.fieldInput)
    inputWrapper.appendChild(this.suffix)
  }

  updateTextFieldState() {
    const isRandomized = this.checkbox.checked

    this.hiddenInput.value = isRandomized ? 'true' : 'false'
    this.dataset.randomized = isRandomized ? 'true' : 'false'

    if (this.fieldInput) {
      this.fieldInput.disabled = isRandomized

      if (isRandomized) {
        this.fieldInput.classList.add('randomizable-field__input--disabled')
      } else {
        this.fieldInput.classList.remove('randomizable-field__input--disabled')
      }
    }
  }

  updateRadioFieldState() {
    const isRandomized = this.randomOption?.checked || false

    this.hiddenInput.value = isRandomized ? 'true' : 'false'
    this.dataset.randomized = isRandomized ? 'true' : 'false'
  }
}

customElements.define('randomizable-field-wrapper', RandomizableFieldWrapper)
