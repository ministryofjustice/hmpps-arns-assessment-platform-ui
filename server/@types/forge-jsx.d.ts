import '@ministryofjustice/hmpps-forge/jsx-components/jsx-runtime'

/**
 * Custom wrapper elements used by our JSX components. The forge JSX runtime only
 * declares standard HTML tags, so custom elements need registering here.
 */
declare module '@ministryofjustice/hmpps-forge/jsx-components/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'wrapping-select-wrapper': { class?: string; children?: JsxChild }
      'accessible-autocomplete-wrapper': { class?: string; children?: JsxChild; [attribute: string]: unknown }
      'randomizable-field-wrapper': { class?: string; children?: JsxChild; [attribute: string]: unknown }
    }
  }
}
