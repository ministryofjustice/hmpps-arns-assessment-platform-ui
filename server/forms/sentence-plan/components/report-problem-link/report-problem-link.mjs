// Phase banner "report a problem" link: scroll to and open the expander
document.querySelectorAll("[data-report-problem-link]").forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.getElementById("report-a-problem");
    if (!target) return;

    e.preventDefault();
    const details = target.querySelector("details");
    if (details && !details.open) {
      details.open = true;
    }
    target.scrollIntoView({ behavior: "smooth" });
  });
});
