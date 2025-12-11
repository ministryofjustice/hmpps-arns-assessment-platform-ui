import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import { SupportWidget } from './support-widget.mjs'

govukFrontend.initAll()
mojFrontend.initAll()

customElements.define('app-support-widget', SupportWidget)
