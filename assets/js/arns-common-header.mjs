export class ArnsCommonHeader extends HTMLElement {
  constructor() {
    super()

    this.$toggle = this.querySelector('.arns-common-header__menu-toggle')
    this.$menu = this.querySelector('.arns-common-header__user-menu')
    this.$fallbackLink = this.querySelector('.arns-common-header__user-menu-link')

    if (!this.$toggle || !this.$menu) {
      return
    }

    this.hideFallbackLink()
    this.$toggle.removeAttribute('hidden')
    this.close()

    this.$toggle.addEventListener('click', () => this.toggleMenu())
  }

  toggleMenu() {
    if (this.$menu.hasAttribute('hidden')) {
      this.open()
    } else {
      this.close()
    }
  }

  open() {
    this.$menu.removeAttribute('hidden')
    this.$toggle.classList.add('arns-common-header__toggle-open')
    this.$toggle.parentElement.classList.add('item-open')
    this.$toggle.setAttribute('aria-expanded', 'true')
  }

  close() {
    this.$menu.setAttribute('hidden', 'hidden')
    this.$toggle.classList.remove('arns-common-header__toggle-open')
    this.$toggle.parentElement.classList.remove('item-open')
    this.$toggle.setAttribute('aria-expanded', 'false')
  }

  hideFallbackLink() {
    if (this.$fallbackLink) {
      this.$fallbackLink.setAttribute('hidden', 'hidden')
    }
  }
}
