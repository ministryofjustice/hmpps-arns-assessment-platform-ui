import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import { initAccordionTelemetry } from './appInsights.mjs'
import { CollapsibleNav } from './collapsible-nav.mjs'
import { SupportWidget } from './support-widget.mjs'
import { initScrollRestore } from './scroll-restore.mjs'
import { initBackToTop } from './back-to-top.mjs'
import { CopyCode } from './copy-code.mjs'
import { SessionTimeoutModal } from './session-timeout-modal.mjs'
import { ArnsCommonHeader } from './arns-common-header.mjs'
import { initAutosizeTextareas } from './autosize-textareas.mjs'
import { initStepStatusTracking } from './step-status-tracking.mjs'
import { initStepActorTracking } from './step-actor-tracking.mjs'
import { initGoalAchievementTracking } from './goal-achievement-tracking.mjs'
import '../../server/forms/sentence-plan/components/copy-button/copy-button.mjs'
import '../../server/forms/sentence-plan/components/report-problem-link/report-problem-link.mjs'

govukFrontend.initAll()
mojFrontend.initAll()
initAccordionTelemetry()
initScrollRestore()
initAutosizeTextareas()
initBackToTop()
initStepStatusTracking()
initStepActorTracking()
initGoalAchievementTracking()

customElements.define('app-copy-code', CopyCode)
customElements.define('app-support-widget', SupportWidget)
customElements.define('moj-collapsible-nav', CollapsibleNav)
customElements.define('moj-session-timeout-modal', SessionTimeoutModal)
customElements.define('arns-common-header', ArnsCommonHeader)
