import '@ministryofjustice/hmpps-forge/jsx-components/jsx-runtime'

declare module '@ministryofjustice/hmpps-forge/jsx-components/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'wrapping-select-wrapper': { class?: string; children?: JsxChild }
      'accessible-autocomplete-wrapper': { class?: string; children?: JsxChild; [attribute: string]: unknown }
    }
  }
}
