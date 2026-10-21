/**
 * Header sent by the PDF renderer when it loads a journey page.
 *
 * The header only changes how the request is labelled. It never grants access or suppresses
 * auditing, so a forged value does not expose protected behaviour.
 */
export const PDF_RENDER_HEADER = 'x-gotenberg-render'
export const PDF_RENDER_HEADER_VALUE = 'true'
