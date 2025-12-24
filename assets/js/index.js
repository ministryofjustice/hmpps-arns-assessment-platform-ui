import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import { CollapsibleNav } from './collapsible-nav.mjs'
import { SupportWidget } from './support-widget.mjs'
import { initScrollRestore } from './scroll-restore.mjs'
import { CopyCode } from './copy-code.mjs'
import { initAccessibleAutocompletes } from './accessible-autocomplete-init.mjs'

govukFrontend.initAll()
mojFrontend.initAll()
initScrollRestore()
initAccessibleAutocompletes()

customElements.define('app-copy-code', CopyCode)
customElements.define('app-support-widget', SupportWidget)
customElements.define('moj-collapsible-nav', CollapsibleNav)
