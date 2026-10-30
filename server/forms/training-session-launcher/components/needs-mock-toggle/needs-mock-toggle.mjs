/**
 * Greys out the criminogenic needs sections while the mocked criminogenic needs checkbox is unticked.
 *
 * Uses inert rather than disabled so the values still submit and are kept when the scenario is saved.
 */
const checkbox = document.querySelector('input[name="useMockedCriminogenicNeeds"]')

if (checkbox) {
  const sections = checkbox.closest('[role="tabpanel"]')?.querySelectorAll('.govuk-details') ?? []

  const updateSections = () => {
    sections.forEach(section => {
      section.toggleAttribute('inert', !checkbox.checked)
      section.classList.toggle('needs-mock-toggle__section--disabled', !checkbox.checked)
    })
  }

  checkbox.addEventListener('change', updateSections)
  updateSections()
}
