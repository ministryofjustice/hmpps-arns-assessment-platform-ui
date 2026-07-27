const printSentencePlanButton = document.querySelector('[data-print-sentence-plan]')

if (printSentencePlanButton) {
  printSentencePlanButton.addEventListener('click', () => window.print())
}
