import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import { CollapsibleNav } from './collapsible-nav.mjs'
import { SupportWidget } from './support-widget.mjs'
import { initScrollRestore } from './scroll-restore.mjs'
import { CopyCode } from './copy-code.mjs'
import { SessionTimeoutModal } from './session-timeout-modal.mjs'
import { ArnsCommonHeader } from './arns-common-header.mjs'

govukFrontend.initAll()
mojFrontend.initAll()
initScrollRestore()

customElements.define('app-copy-code', CopyCode)
customElements.define('app-support-widget', SupportWidget)
customElements.define('moj-collapsible-nav', CollapsibleNav)
customElements.define('moj-session-timeout-modal', SessionTimeoutModal)
customElements.define('arns-common-header', ArnsCommonHeader)
