import type nunjucks from 'nunjucks'
import {
  BlockDefinition,
  ConditionalString,
  EvaluatedBlock,
  RenderedBlock,
} from '@form-engine/form/types/structures.type'
import { ValueExpr } from '@form-engine/form/types/expressions.type'
import { buildNunjucksComponent } from '@form-engine-express-nunjucks/utils/buildNunjucksComponent'
import { block } from '@form-engine/form/builders'

/**
 * A single item in the TabPanel sidebar
 */
export interface TabPanelItem {
  /** Identifier for this item (used for panel switching) */
  id: ConditionalString

  /** Primary label shown in the sidebar */
  label: ConditionalString

  /** Optional secondary label (e.g., location, category) */
  sublabel?: ConditionalString

  /** Blocks to render in the panel when this item is selected */
  panel: BlockDefinition[]
}

/**
 * Props for the TabPanel block component.
 */
export interface TabPanelProps {
  /** Unique ID for the component */
  id?: ConditionalString

  /** Title shown above the sidebar list */
  sidebarTitle?: ConditionalString

  /**
   * Array of selectable items.
   * Can be a static array or a Data reference with Iterator.Map
   */
  items: TabPanelItem[] | ValueExpr

  /** ID of the initially selected item (defaults to first item) */
  defaultSelected?: ConditionalString

  /** Optional blocks to render in the sidebar footer */
  sidebarFooter?: BlockDefinition[]

  /** Additional CSS classes */
  classes?: ConditionalString

  /**
   * Query parameter name for syncing selected tab with URL.
   * When set, the component will:
   * - Read the initial selection from the URL query param
   * - Update the URL when tabs are selected (without page reload)
   */
  queryParam?: ConditionalString
}

/**
 * TabPanel block component definition.
 * A generic two-column layout with selectable items on the left and content panels on the right.
 */
export interface TabPanel extends BlockDefinition, TabPanelProps {
  variant: 'tabPanel'
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
 * Renders the TabPanel block component
 */
export const tabPanel = buildNunjucksComponent<TabPanel>(
  'tabPanel',
  async (evaluated: EvaluatedBlock<TabPanel>, nunjucksEnv: nunjucks.Environment) => {
    const id = evaluated.id || 'tab-panel'
    const classes = ['tab-panel', evaluated.classes].filter(Boolean).join(' ')

    // Cast to evaluated items (form-engine has already rendered the panel blocks)
    const items = evaluated.items as EvaluatedTabPanelItem[]

    // Get the selected item - either from prop or default to first item
    const selectedId = evaluated.defaultSelected || items[0]?.id || ''

    // Render sidebar footer blocks if provided
    const sidebarFooter = evaluated.sidebarFooter as RenderedBlock[] | undefined

    return nunjucksEnv.render('training-session-launcher/components/tab-panel/template.njk', {
      params: {
        id,
        selectedId,
        classes,
        sidebarTitle: evaluated.sidebarTitle || 'Options',
        items,
        sidebarFooter,
        queryParam: evaluated.queryParam,
      },
    })
  },
)

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
export function TabPanel(props: TabPanelProps): TabPanel {
  return block<TabPanel>({ ...props, variant: 'tabPanel' })
}
