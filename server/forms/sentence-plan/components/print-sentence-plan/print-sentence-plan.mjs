// Copy the print-header values onto <html> so the `@page` header can read them via attr().
const printPageHeader = document.querySelector('[data-print-page-header]')

if (printPageHeader) {
  const { printPlanTitle, printPersonName, printCrn, printPnc, printDateOfBirth } = printPageHeader.dataset

  Object.assign(document.documentElement.dataset, {
    printPlanTitle,
    printPersonName,
    printCrn,
    printPnc,
    printDateOfBirth,
  })
}

const printSentencePlanButton = document.querySelector('[data-print-sentence-plan]')

if (printSentencePlanButton) {
  printSentencePlanButton.addEventListener('click', () => window.print())
}
