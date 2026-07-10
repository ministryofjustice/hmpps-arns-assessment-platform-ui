function autosizeTextarea(textarea) {
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
}

export function initAutosizeTextareas(root = document) {
  root.querySelectorAll('textarea[data-autosize="true"]').forEach(textarea => {
    if (!(textarea instanceof HTMLTextAreaElement) || textarea.dataset.autosizeInitialised === 'true') {
      return
    }

    textarea.dataset.autosizeInitialised = 'true'
    autosizeTextarea(textarea)
    textarea.addEventListener('input', () => autosizeTextarea(textarea))
  })
}
