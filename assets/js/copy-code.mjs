/**
 * Copy Code Button
 *
 * Custom element that adds a "Copy code" button to code blocks.
 * Uses the native Clipboard API - no dependencies needed.
 *
 * Usage: <app-copy-code><pre><code>...</code></pre></app-copy-code>
 */
export class CopyCode extends HTMLElement {
  constructor() {
    super()

    this.$pre = this.querySelector('pre')

    if (!this.$pre) {
      return
    }

    this.$button = document.createElement('button')
    this.$button.className = 'app-copy-button'
    this.$button.setAttribute('type', 'button')
    this.$button.setAttribute('aria-live', 'assertive')
    this.$button.textContent = 'Copy code'

    this.$button.addEventListener('click', () => this.copy())
    this.insertBefore(this.$button, this.firstChild)
  }

  async copy() {
    const code = this.$pre.textContent || ''

    try {
      await navigator.clipboard.writeText(code)
      this.$button.textContent = 'Code copied'

      setTimeout(() => {
        this.$button.textContent = 'Copy code'
      }, 5000)
    } catch (err) {

      console.error('Failed to copy code:', err)
      this.$button.textContent = 'Copy failed'

      setTimeout(() => {
        this.$button.textContent = 'Copy code'
      }, 2000)
    }
  }
}
