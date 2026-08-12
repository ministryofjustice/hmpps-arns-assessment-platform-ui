import {
  BlockDefinition,
  ResolvableArray,
  ResolvableString,
  RenderedBlock,
} from '@ministryofjustice/hmpps-forge/core/components'
import { nunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'

/**
 * A single item in the TabPanel sidebar
 */
export interface TabPanelItem {
  /** Identifier for this item (used for panel switching) */
  id: ResolvableString

  /** Primary label shown in the sidebar */
  label: ResolvableString

  /** Optional secondary label (e.g., location, category) */
  sublabel?: ResolvableString

  /** Blocks to render in the panel when this item is selected */
  panel: BlockDefinition[]
}

/**
 * TabPanel block component.
 * A generic two-column layout with selectable items on the left and content panels on the right.
 */
export interface TabPanel extends BlockDefinition {
  /** Unique ID for the component */
  id?: ResolvableString

  /** Title shown above the sidebar list */
  sidebarTitle?: ResolvableString

  /**
   * Array of selectable items.
   * Can be a static array or a Data reference with Iterator.Map
   */
  items: ResolvableArray<TabPanelItem>

  /** ID of the initially selected item (defaults to first item) */
  defaultSelected?: ResolvableString

  /** Optional blocks to render in the sidebar footer */
  sidebarFooter?: BlockDefinition[]

  /** Additional CSS classes */
  classes?: ResolvableString

  /**
   * Query parameter name for syncing selected tab with URL.
   * When set, the component will:
   * - Read the initial selection from the URL query param
   * - Update the URL when tabs are selected (without page reload)
   */
  queryParam?: ResolvableString
}

/**
 * Evaluated item with rendered panel content
 */
interface EvaluatedTabPanelItem {
  id: string
  label: string
  sublabel?: string
  panel: RenderedBlock[]
}

/**
 * Creates a TabPanel block for displaying selectable items with associated content panels.
 *
 * @example
 * ```typescript
 * TabPanel({
 *   id: 'my-panel',
 *   sidebarTitle: 'Choose an option',
 *   defaultSelected: 'option-1',
 *   items: [
 *     {
 *       id: 'option-1',
 *       label: 'Option One',
 *       sublabel: 'Description',
 *       panel: [
 *         HtmlBlock({ content: '<h2>Option One Details</h2>' }),
 *         GovUKButton({ text: 'Select this option' }),
 *       ],
 *     },
 *   ],
 *   sidebarFooter: [
 *     HtmlBlock({ content: '<a href="/custom">+ Custom option</a>' }),
 *   ],
 * })
 * ```
 */
export const TabPanel = nunjucksComponent<TabPanel>('tabPanel', {
  render: (props, nunjucksEnv) => {
    const id = props.id || 'tab-panel'
    const classes = ['tab-panel', props.classes].filter(Boolean).join(' ')

    // Cast to evaluated items (form-engine has already rendered the panel blocks)
    const items = props.items as EvaluatedTabPanelItem[]

    // Get the selected item - either from prop or default to first item
    const selectedId = props.defaultSelected || items[0]?.id || ''

    // Render sidebar footer blocks if provided
    const sidebarFooter = props.sidebarFooter as RenderedBlock[] | undefined

    return nunjucksEnv.render('training-session-launcher/components/tab-panel/template.njk', {
      params: {
        id,
        selectedId,
        classes,
        sidebarTitle: props.sidebarTitle || 'Options',
        items,
        sidebarFooter,
        queryParam: props.queryParam,
      },
    })
  },
})
