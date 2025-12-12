import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import { SupportWidget } from './support-widget.mjs'
import { CopyCode } from './copy-code.mjs'

govukFrontend.initAll()
mojFrontend.initAll()

customElements.define('app-copy-code', CopyCode)
customElements.define('app-support-widget', SupportWidget)
