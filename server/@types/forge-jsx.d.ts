import '@ministryofjustice/hmpps-forge/jsx-components/jsx-runtime'

/**
 * Custom wrapper elements used by platform-owned JSX components. The forge JSX
 * runtime only declares standard HTML tags, so custom elements need registering here.
 */
declare module '@ministryofjustice/hmpps-forge/jsx-components/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'randomizable-field-wrapper': { class?: string; children?: JsxChild; [attribute: string]: unknown }
    }
  }
}
