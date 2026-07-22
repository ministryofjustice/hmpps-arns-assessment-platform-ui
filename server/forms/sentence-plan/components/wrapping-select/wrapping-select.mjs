/**
 * WrappingSelect: an accessible combobox that wraps long option labels on both
 * closed and open states. Reads options from an underlying <select> and writes
 * selections back to it so form submission is unchanged.
 *
 * Implements the ARIA 1.2 "combobox with listbox popup" pattern.
 */

class WrappingSelect extends HTMLElement {
  constructor() {
    super()

    if (this.dataset.initialized === 'true') {
      return
    }

    this.dataset.initialized = 'true'

    this.selectEl = this.querySelector('select')

    if (!this.selectEl) {
      console.warn('wrapping-select: no <select> found inside wrapper', this)
      return
    }

    this.buildCombobox()
    this.attachEvents()
  }

  buildCombobox() {
    const options = Array.from(this.selectEl.options)

    if (options.length === 0) {
      return
    }

    const selectId = this.selectEl.id
    const labelledBy = this.selectEl.getAttribute('aria-labelledby')
    const describedBy = this.selectEl.getAttribute('aria-describedby')
    const labelEl = selectId ? document.querySelector(`label[for="${selectId}"]`) : null

    // Hand the original id to the toggle so error summary links (which point at
    // selectId) focus the visible control. The native select keeps a suffixed id
    // for form submission and as the no-JS fallback.
    if (selectId) {
      this.selectEl.id = `${selectId}-native`
      if (labelEl) {
        labelEl.setAttribute('for', selectId)
      }
    }
    const associatedLabelId = labelEl?.id ?? null

    // Move the native select out of the tab order; keep it for form submission
    // and as the no-JS fallback. Visually hidden via CSS once we add the class.
    this.classList.add('wrapping-select--enhanced')
    this.selectEl.setAttribute('tabindex', '-1')
    this.selectEl.setAttribute('aria-hidden', 'true')

    const selectedIndex = this.selectEl.selectedIndex >= 0 ? this.selectEl.selectedIndex : 0
    const selectedOption = options[selectedIndex]

    const toggle = document.createElement('button')
    toggle.type = 'button'
    toggle.id = selectId || `${this.selectEl.name}-toggle`
    toggle.className = 'wrapping-select__toggle'

    // The toggle is created in the browser, so derive its tag from the select.
    const dataTag = this.selectEl.getAttribute('data-ai-id')
    if (dataTag) {
      toggle.setAttribute('data-ai-id', `${dataTag}-toggle-button`)
    }
    toggle.setAttribute('aria-haspopup', 'listbox')
    toggle.setAttribute('aria-expanded', 'false')

    const labelIds = [associatedLabelId, labelledBy, toggle.id].filter(Boolean).join(' ')
    if (labelIds) {
      toggle.setAttribute('aria-labelledby', labelIds)
    }

    if (describedBy) {
      toggle.setAttribute('aria-describedby', describedBy)
    }

    const toggleLabel = document.createElement('span')
    toggleLabel.className = 'wrapping-select__toggle-label'
    toggleLabel.textContent = selectedOption.text

    const arrow = document.createElement('span')
    arrow.className = 'wrapping-select__arrow'
    arrow.setAttribute('aria-hidden', 'true')

    toggle.append(toggleLabel, arrow)

    const menu = document.createElement('ul')
    menu.id = `${selectId}-menu`
    menu.className = 'wrapping-select__menu'
    menu.setAttribute('role', 'listbox')
    menu.hidden = true

    if (associatedLabelId) {
      menu.setAttribute('aria-labelledby', associatedLabelId)
    }

    options.forEach((opt, idx) => {
      const li = document.createElement('li')
      li.id = `${selectId}-option-${idx}`
      li.className = 'wrapping-select__option'
      li.setAttribute('role', 'option')
      li.dataset.value = opt.value
      li.textContent = opt.text

      if (idx === selectedIndex) {
        li.setAttribute('aria-selected', 'true')
      }

      menu.appendChild(li)
    })

    this.toggle = toggle
    this.toggleLabel = toggleLabel
    this.menu = menu

    // Append into the surrounding .govuk-form-group when present so the red
    // error border (which only paints around form-group contents) extends down
    // alongside the visible toggle, not just the error message.
    const formGroup = this.selectEl.closest('.govuk-form-group')
    const host = formGroup ?? this
    host.appendChild(toggle)
    host.appendChild(menu)
  }

  attachEvents() {
    if (!this.toggle || !this.menu) {
      return
    }

    this.toggle.addEventListener('click', () => this.toggleMenu())
    this.toggle.addEventListener('keydown', e => this.handleToggleKeydown(e))
    this.menu.addEventListener('click', e => this.handleMenuClick(e))
    this.menu.addEventListener('mousemove', e => this.handleMenuHover(e))
    this.menu.addEventListener('keydown', e => this.handleMenuKeydown(e))

    document.addEventListener('click', e => {
      if (!this.contains(e.target)) {
        this.closeMenu()
      }
    })
  }

  toggleMenu() {
    if (this.menu.hidden) {
      this.openMenu()
    } else {
      this.closeMenu()
    }
  }

  openMenu() {
    this.menu.hidden = false
    this.toggle.setAttribute('aria-expanded', 'true')

    const current = this.menu.querySelector('[aria-selected="true"]') ?? this.menu.querySelector('[role="option"]')

    if (current) {
      this.setActive(current)
    }

    this.menu.setAttribute('tabindex', '-1')
    this.menu.focus()
  }

  closeMenu() {
    if (this.menu.hidden) {
      return
    }

    this.menu.hidden = true
    this.toggle.setAttribute('aria-expanded', 'false')
    this.toggle.removeAttribute('aria-activedescendant')
    this.clearActive()
  }

  selectOption(value) {
    const opt = Array.from(this.menu.querySelectorAll('[role="option"]')).find(li => li.dataset.value === value)

    if (!opt) {
      return
    }

    this.menu.querySelectorAll('[role="option"]').forEach(o => o.removeAttribute('aria-selected'))
    opt.setAttribute('aria-selected', 'true')

    this.toggleLabel.textContent = opt.textContent
    this.selectEl.value = value
    this.selectEl.dispatchEvent(new Event('change', { bubbles: true }))

    this.closeMenu()
    this.toggle.focus()
  }

  setActive(li) {
    this.clearActive()
    li.classList.add('wrapping-select__option--active')
    this.toggle.setAttribute('aria-activedescendant', li.id)
    li.scrollIntoView({ block: 'nearest' })
  }

  clearActive() {
    this.menu
      .querySelectorAll('.wrapping-select__option--active')
      .forEach(o => o.classList.remove('wrapping-select__option--active'))
  }

  handleToggleKeydown(e) {
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
      e.preventDefault()
      this.openMenu()
    }
  }

  handleMenuClick(e) {
    const li = e.target.closest('[role="option"]')

    if (li) {
      this.selectOption(li.dataset.value)
    }
  }

  handleMenuHover(e) {
    const li = e.target.closest('[role="option"]')

    if (li) {
      this.setActive(li)
    }
  }

  handleMenuKeydown(e) {
    const options = Array.from(this.menu.querySelectorAll('[role="option"]'))
    const activeId = this.toggle.getAttribute('aria-activedescendant')
    const activeIdx = options.findIndex(o => o.id === activeId)

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        this.setActive(options[Math.min(activeIdx + 1, options.length - 1)])
        break
      case 'ArrowUp':
        e.preventDefault()
        this.setActive(options[Math.max(activeIdx - 1, 0)])
        break
      case 'Home':
        e.preventDefault()
        this.setActive(options[0])
        break
      case 'End':
        e.preventDefault()
        this.setActive(options[options.length - 1])
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (activeIdx >= 0) {
          this.selectOption(options[activeIdx].dataset.value)
        }
        break
      case 'Escape':
        e.preventDefault()
        this.closeMenu()
        this.toggle.focus()
        break
      case 'Tab':
        this.closeMenu()
        break
      default:
        if (e.key.length === 1) {
          this.typeAhead(e.key, options, activeIdx)
        }
    }
  }

  typeAhead(char, options, activeIdx) {
    const lower = char.toLowerCase()

    for (let step = 1; step <= options.length; step += 1) {
      const idx = (activeIdx + step) % options.length

      if (options[idx].textContent.trim().toLowerCase().startsWith(lower)) {
        this.setActive(options[idx])
        return
      }
    }
  }
}

customElements.define('wrapping-select-wrapper', WrappingSelect)
