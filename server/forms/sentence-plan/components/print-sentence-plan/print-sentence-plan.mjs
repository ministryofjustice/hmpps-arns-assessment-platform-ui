// Copy the print-header values onto <html> so the `@page` header can read them via attr().
const printPageHeader = document.querySelector('[data-print-page-header]')

if (printPageHeader) {
  const { printPlanTitle, printPersonName, printIdentifiers } = printPageHeader.dataset

  Object.assign(document.documentElement.dataset, {
    printPlanTitle,
    printPersonName,
    printIdentifiers,
  })
}

const printSentencePlanButton = document.querySelector('[data-print-sentence-plan]')

if (printSentencePlanButton) {
  printSentencePlanButton.addEventListener('click', () => window.print())
}
