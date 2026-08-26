import { TabPanel } from './tab-panel/tabPanel'
import { criminogenicNeedsList } from './criminogenic-needs-list/criminogenicNeedsList'
import { randomizableField } from './randomizable-field/randomizableField'

export const trainingSessionLauncherComponents = [TabPanel, criminogenicNeedsList, randomizableField]

export { TabPanel, type TabPanelItem } from './tab-panel/tabPanel'
export { CriminogenicNeedsList, type CriminogenicNeedsListProps } from './criminogenic-needs-list/criminogenicNeedsList'
export { RandomizableField, type RandomizableFieldProps } from './randomizable-field/randomizableField'
