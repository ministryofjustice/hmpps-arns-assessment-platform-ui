/**
 * Session Timeout Modal Web Component
 *
 * Displays a warning modal when the user has been inactive for a configurable period.
 * Follows the MOJ modal dialog design pattern.
 *
 * Usage:
 * <moj-session-timeout-modal
 *   data-warning-after-inactive-seconds="3000"
 *   data-countdown-seconds="600"
 *   data-timeout-redirect-url="/sentence-plan/unsaved-information-deleted">
 * </moj-session-timeout-modal>
 *
 * Attributes:
 * - data-warning-after-inactive-seconds: Show warning after this many seconds of inactivity (default: 3000 = 50 mins)
 * - data-countdown-seconds: Countdown duration once modal is shown in seconds (default: 600 = 10 mins)
 * - data-timeout-redirect-url: URL to redirect to on timeout or delete (default: /sentence-plan/unsaved-information-deleted)
 * - data-auth-source: The authentication source (e.g., OASys) to pass through for re-authentication
 */

// Only track meaningful interactions - not passive movements
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'touchstart', 'click', 'submit']

export class SessionTimeoutModal extends HTMLElement {
  constructor() {
    super()

    // Configuration from data attributes
    this.warningAfterInactiveSeconds = parseInt(this.dataset.warningAfterInactiveSeconds, 10) || 3000
    this.countdownSeconds = parseInt(this.dataset.countdownSeconds, 10) || 600
    this.timeoutRedirectUrl = this.dataset.timeoutRedirectUrl || '/sentence-plan/unsaved-information-deleted'
    this.authSource = this.dataset.authSource || ''
    this.csrfToken = this.dataset.csrfToken || ''

    // State
    this.lastActivityTime = Date.now()
    this.isModalOpen = false
    this.inactivityTimer = null
    this.countdownTimer = null
    this.remainingSeconds = 0

    // Bind methods
    this.handleActivity = this.handleActivity.bind(this)
    this.checkInactivity = this.checkInactivity.bind(this)
    this.handleContinueSession = this.handleContinueSession.bind(this)
    this.handleDeleteInfo = this.handleDeleteInfo.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)

    this.setupActivityListeners()
    this.startInactivityCheck()
  }

  render() {
    this.innerHTML = `
      <div class="moj-session-timeout-modal" role="alertdialog" aria-labelledby="session-timeout-title" aria-describedby="session-timeout-description" aria-modal="true">
        <div class="moj-session-timeout-modal__backdrop"></div>
        <div class="moj-session-timeout-modal__dialog" tabindex="-1">
          <h2 class="govuk-heading-l" id="session-timeout-title">Your unsaved information will be deleted soon</h2>
          <p class="govuk-body" id="session-timeout-description">
            We will delete any unsaved information if you do not continue in the next <strong class="moj-session-timeout-modal__countdown"></strong>. This is to protect your information.
          </p>
          <div class="moj-session-timeout-modal__actions">
            <button type="button" class="govuk-button" data-action="continue">
              Continue using sentence plan
            </button>
            <a href="#" class="govuk-link moj-session-timeout-modal__delete-link" data-action="delete">
              Delete unsaved information
            </a>
          </div>
        </div>
      </div>
    `

    this.$modal = this.querySelector('.moj-session-timeout-modal')
    this.$dialog = this.querySelector('.moj-session-timeout-modal__dialog')
    this.$countdown = this.querySelector('.moj-session-timeout-modal__countdown')
    this.$continueButton = this.querySelector('[data-action="continue"]')
    this.$deleteLink = this.querySelector('[data-action="delete"]')

    this.$continueButton.addEventListener('click', this.handleContinueSession)
    this.$deleteLink.addEventListener('click', this.handleDeleteInfo)
    document.addEventListener('keydown', this.handleKeyDown)
  }

  setupActivityListeners() {
    ACTIVITY_EVENTS.forEach(event => {
      document.addEventListener(event, this.handleActivity, { passive: true })
    })
  }

  handleActivity() {
    if (!this.isModalOpen) {
      this.lastActivityTime = Date.now()
    }
  }

  startInactivityCheck() {
    this.inactivityTimer = setInterval(this.checkInactivity, 1000)
  }

  checkInactivity() {
    if (this.isModalOpen) return

    const inactiveSeconds = Math.floor((Date.now() - this.lastActivityTime) / 1000)

    if (inactiveSeconds >= this.warningAfterInactiveSeconds) {
      this.showModal()
    }
  }

  showModal() {
    if (this.isModalOpen) return

    this.isModalOpen = true
    this.remainingSeconds = this.countdownSeconds

    // Lazy render - only add modal to DOM when needed
    if (!this.$modal) {
      this.render()
    }

    document.body.classList.add('moj-session-timeout-modal--open')

    const mainContent = document.querySelector('main')
    if (mainContent) {
      mainContent.inert = true
    }

    // Focus the dialog for screen reader announcement (not the button, to avoid yellow highlight)
    this.$dialog.focus()

    this.updateCountdown()
    this.countdownTimer = setInterval(() => {
      this.remainingSeconds -= 1

      if (this.remainingSeconds <= 0) {
        this.handleSessionExpired()
      } else {
        this.updateCountdown()
      }
    }, 1000)
  }

  hideModal() {
    this.isModalOpen = false
    document.body.classList.remove('moj-session-timeout-modal--open')

    const mainContent = document.querySelector('main')
    if (mainContent) {
      mainContent.inert = false
    }

    this.clearCountdownTimer()

    // Remove modal from DOM to avoid selector conflicts
    if (this.$modal) {
      this.$continueButton.removeEventListener('click', this.handleContinueSession)
      this.$deleteLink.removeEventListener('click', this.handleDeleteInfo)
      document.removeEventListener('keydown', this.handleKeyDown)
      this.innerHTML = ''
      this.$modal = null
      this.$dialog = null
      this.$countdown = null
      this.$continueButton = null
      this.$deleteLink = null
    }
  }

  clearAllTimers() {
    if (this.inactivityTimer) {
      clearInterval(this.inactivityTimer)
      this.inactivityTimer = null
    }
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
      this.countdownTimer = null
    }
  }

  clearCountdownTimer() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
      this.countdownTimer = null
    }
  }

  updateCountdown() {
    if (!this.$countdown) return

    const minutes = Math.floor(this.remainingSeconds / 60)
    const seconds = this.remainingSeconds % 60

    // Show minutes when >= 1 minute, switch to seconds when < 1 minute for urgency
    this.$countdown.textContent =
      minutes >= 1 ? `${minutes} minute${minutes !== 1 ? 's' : ''}` : `${seconds} second${seconds !== 1 ? 's' : ''}`
  }

  getRedirectUrl() {
    // Append auth source as query param so the unsaved-info page knows how to re-authenticate
    if (this.authSource) {
      const separator = this.timeoutRedirectUrl.includes('?') ? '&' : '?'
      return `${this.timeoutRedirectUrl}${separator}auth=${encodeURIComponent(this.authSource)}`
    }
    return this.timeoutRedirectUrl
  }

  async handleContinueSession() {
    try {
      const response = await fetch('/session/extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `_csrf=${encodeURIComponent(this.csrfToken)}`,
      })
      if (!response.ok) {
        // Session likely already expired on server - redirect to timeout page
        window.location.href = this.getRedirectUrl()
        return
      }
    } catch {
      // Network error or server unavailable - redirect to timeout page
      window.location.href = this.getRedirectUrl()
      return
    }

    this.lastActivityTime = Date.now()
    this.hideModal()
  }

  handleDeleteInfo(event) {
    event.preventDefault()
    this.clearAllTimers()
    window.location.href = this.getRedirectUrl()
  }

  // Focus trap and keyboard handling
  // - Tab/Shift+Tab: circular navigation including dialog (for screen reader access to content)
  // - Escape: intentionally does NOT close the modal - user must explicitly choose to continue or delete
  handleKeyDown(event) {
    if (!this.isModalOpen) return

    // Prevent Escape from closing the modal - user must make an explicit choice
    if (event.key === 'Escape') {
      event.preventDefault()
      return
    }

    if (event.key === 'Tab') {
      // Include dialog in focus trap so screen reader users can Tab back to hear content
      const focusableElements = [this.$dialog, this.$continueButton, this.$deleteLink]
      const currentIndex = focusableElements.indexOf(document.activeElement)

      event.preventDefault()
      if (event.shiftKey) {
        const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1
        focusableElements[prevIndex].focus()
      } else {
        const nextIndex = currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1
        focusableElements[nextIndex].focus()
      }
    }
  }

  handleSessionExpired() {
    this.clearAllTimers()
    window.location.href = this.getRedirectUrl()
  }

  disconnectedCallback() {
    ACTIVITY_EVENTS.forEach(event => {
      document.removeEventListener(event, this.handleActivity)
    })
    if (this.$modal) {
      this.$continueButton.removeEventListener('click', this.handleContinueSession)
      this.$deleteLink.removeEventListener('click', this.handleDeleteInfo)
      document.removeEventListener('keydown', this.handleKeyDown)
    }
    this.clearAllTimers()
  }
}
