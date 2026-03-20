// Copy button: copies target element text to clipboard (MOJ design pattern)
// https://design-patterns.service.justice.gov.uk/components/copy-button
document.querySelectorAll("[data-copy-target]").forEach((button) => {
  const originalText = button.textContent.trim();

  button.addEventListener("click", (e) => {
    e.preventDefault();

    const targetId = button.getAttribute("data-copy-target");
    const target = document.getElementById(targetId);
    if (!target) return;

    const screenReaderAlert = document.getElementById("copy-alert");

    navigator.clipboard.writeText(target.textContent.trim());

    if (screenReaderAlert) {
      screenReaderAlert.textContent = "Support details copied";
    }

    button.classList.add("disable-click");
    button.textContent = "Copied";

    setTimeout(() => {
      if (screenReaderAlert) {
        screenReaderAlert.textContent = "";
      }
      button.classList.remove("disable-click");
      button.textContent = originalText;
    }, 4000);

    button.blur();
  });
});
