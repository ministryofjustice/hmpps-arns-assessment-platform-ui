import accessibleAutocomplete from "accessible-autocomplete";

class AccessibleAutocomplete extends HTMLElement {
  constructor() {
    super();
    if (this.dataset.initialized) {
      return;
    }

    this.dataset.initialized = "true";

    const input = this.querySelector("input");

    if (!input) {
      console.warn("accessible-autocomplete: no input found", this);
      return;
    }

    const source = this.getSource();
    const defaultValue = this.dataset.autocompleteDefaultValue ?? input.value;
    const inputId = input.id;
    const inputName = input.name;
    const errorId = `${inputId}-error`;
    const originalDescribedByErrorIds = (input.getAttribute("aria-describedby") ?? "")
      .split(" ")
      .filter((id) => id === errorId);

    input.remove();

    accessibleAutocomplete({
      element: this,
      id: `${inputId}`,
      name: inputName,
      source,
      defaultValue,
      minLength: parseInt(this.dataset.autocompleteMinLength ?? "2", 10),
      showNoOptionsFound: this.dataset.autocompleteShowNoOptions === "true",
      menuClasses: this.dataset.autocompleteMenuClasses ?? null,
      inputClasses: this.dataset.autocompleteInputClasses ?? null,
      hintClasses: this.dataset.autocompleteHintClasses ?? null,
      autoselect: this.dataset.autocompleteAutoselect === "true",
      confirmOnBlur: this.dataset.autocompleteConfirmOnBlur !== "false",
      displayMenu: this.dataset.autocompleteDisplayMenu ?? "inline",
      showAllValues: this.dataset.autocompleteShowAllValues === "true",
      menuAttributes: this.dataset.autocompleteMenuAttributes
        ? JSON.parse(this.dataset.autocompleteMenuAttributes)
        : {},
    });
    this.preserveDescribedBy(originalDescribedByErrorIds);
  }

  preserveDescribedBy(originalIds) {
    if (originalIds.length === 0) {
      return;
    }

    const input = this.querySelector("input");

    if (!input) {
      return;
    }

    const merge = () => {
      const current = (input.getAttribute("aria-describedby") ?? "").split(" ").filter(Boolean);
      const merged = [...new Set([...current, ...originalIds])].join(" ");

      if (merged !== input.getAttribute("aria-describedby")) {
        observer.disconnect();
        input.setAttribute("aria-describedby", merged);
        observer.observe(input, { attributes: true, attributeFilter: ["aria-describedby"] });
      }
    };

    const observer = new MutationObserver(merge);
    observer.observe(input, { attributes: true, attributeFilter: ["aria-describedby"] });
    merge();
  }

  getSource() {
    const sourceId = this.dataset.autocompleteSource;

    if (!sourceId) {
      return [];
    }

    const data = this.getData(sourceId);
    const keyFromSelector = this.dataset.autocompleteSourceKeyFrom;

    if (keyFromSelector && typeof data === "object" && !Array.isArray(data)) {
      const keyElement = document.querySelector(keyFromSelector);
      const key = keyElement?.value ?? "";

      return data[key] ?? [];
    }

    return Array.isArray(data) ? data : [];
  }

  getData(sourceId) {
    const el = document.getElementById(sourceId);

    if (!el) {
      console.warn(`accessible-autocomplete: data element #${sourceId} not found`);
      return {};
    }

    try {
      return JSON.parse(el.textContent || "{}");
    } catch (e) {
      console.error(`accessible-autocomplete: failed to parse JSON from #${sourceId}`, e);
      return {};
    }
  }
}

customElements.define("accessible-autocomplete-wrapper", AccessibleAutocomplete);
