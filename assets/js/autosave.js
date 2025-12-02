(function initialiseAutosave() {
  let formHasChangesToBePersisted = false;

  const isTypeOf = (elementType) => (element) => element.type === elementType;

  const isRadio = isTypeOf("radio");
  const isCheckbox = isTypeOf("checkbox");
  const isSelect = (element) => isTypeOf("select-one")(element) || isTypeOf("select-multiple")(element);

  function getForm() {
    return document.querySelector('form[data-autosave="true"]');
  }

  function getFormElements() {
    return getForm()?.elements;
  }

  function hasFormOnPage() {
    return getForm() !== null;
  }

  function persistForm() {
    const form = getForm();
    const formData = new URLSearchParams(new FormData(form));
    const [formAction] = form?.getAttribute("action").split("#");
    const endpoint = formAction;

    document.dispatchEvent(new CustomEvent("autosave"));

    return fetch(endpoint, {
      method: "POST",
      body: formData,
      headers: {
        "X-AAP-Autosave": "true",
      },
    });
  }

  function addListenersToFormElements() {
    const formElements = getFormElements();

    let timeoutHandle = null;

    const handleEvent = () => {
      formHasChangesToBePersisted = true;

      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }

      console.log("Detected change - setting timeout");

      timeoutHandle = setTimeout(() => {
        persistForm()
          .then((response) =>
            response.text().then((text) => {
              console.log(`Form persisted: ${text}`);
              formHasChangesToBePersisted = false;
            }),
          )
          .catch((e) => console.error(`Failed to persist form: ${e.message}`));
      }, 5 * 1000);
    };

    document.addEventListener("keyup", handleEvent);

    for (const element of formElements) {
      if (isRadio(element) || isCheckbox(element) || isSelect(element)) {
        element.addEventListener("click", handleEvent);
      }
    }

    const links = document.getElementsByTagName("a");

    const handleLink = (link) => {
      if (!link.target || link.target === "_self") {
        window.location = link.href;
      } else {
        window.open(link.href, link.target);
      }
    };

    for (const link of links) {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        if (formHasChangesToBePersisted) {
          return persistForm()
            .then((response) =>
              response.text().then((text) => {
                console.log(`Form persisted: ${text}`);
                handleLink(link);
              }),
            )
            .catch((e) => console.error(`Failed to persist form: ${e.message}`));
        } else {
          handleLink(link);
        }
      });
    }

    getForm().addEventListener("submit", () => {
      console.log("User submitting - clearing timeout");
      clearTimeout(timeoutHandle);
    });
  }

  window.addEventListener("load", () => {
    if (hasFormOnPage()) {
      console.log(`Form detected, initialising autosave`);
      addListenersToFormElements();
      getForm().setAttribute("data-autosave-enabled", true);
    }
  });
})();
