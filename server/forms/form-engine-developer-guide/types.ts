import EffectFunctionContext from '@form-engine/core/nodes/expressions/effect/EffectFunctionContext'

// -----------------------------------------------------------------------------
// Helper Types
// -----------------------------------------------------------------------------

interface PlaygroundItem {
  id: string
  name: string
  description: string
  category: string
  priority: string
}

interface InlineStep {
  id: string
  who: string
  action: string
}

interface DemoItem {
  id: string
  name: string
  status: string
}

interface TeamMember {
  name: string
  email: string
  role: string
}

interface TableRow {
  name: string
  role: string
  status: string
}

interface Expense {
  category: string
  description: string
  amount: string
}

interface Team {
  name: string
  members: { name: string; skill: string }[]
}

interface Category {
  name: string
  color: string
  tasks: { name: string; priority: string }[]
}

interface Task {
  task: string
  status: string
  priority: string
}

interface Article {
  title: string
  description: string
  status: string
  views: number
}

// -----------------------------------------------------------------------------
// Typed Effect Context
// -----------------------------------------------------------------------------

/**
 * Data stored via context.setData() / context.getData()
 */
export interface DeveloperGuideData extends Record<string, unknown> {
  csrfToken: string

  // Guide state
  guide: {
    startedAt: string
    conceptsVisited: string[]
  }

  // Demo collections
  demoItems: DemoItem[]
  simpleListItems: { name: string }[]
  teamMembers: TeamMember[]
  tableRows: TableRow[]
  expenses: Expense[]
  teams: Team[]
  categories: Category[]
  tasks: Task[]
  searchResults: { title: string; url: string }[]
  articles: Article[]
  editableTeamMembers: { name: string; role: string }[]

  // Playground
  playgroundItems: PlaygroundItem[]
  isNewItem: boolean
  itemNotFound: boolean

  // Inline steps
  inlineSteps: InlineStep[]
}

/**
 * Form answers via context.setAnswer() / context.getAnswer()
 */
export interface DeveloperGuideAnswers extends Record<string, unknown> {
  // Playground task form
  taskName: string
  taskDescription: string
  taskCategory: string
  taskPriority: string

  // Dynamic inline step fields
  [key: `who_${number}`]: string
  [key: `action_${number}`]: string
}

/**
 * Session data via context.getSession()
 */
export interface DeveloperGuideSession {
  guideInitialized?: boolean
  startedAt?: string
  conceptsVisited?: string[]
  playgroundItems?: PlaygroundItem[]
  inlineSteps?: InlineStep[]
}

/**
 * Request state via context.getState()
 */
export interface DeveloperGuideState extends Record<string, unknown> {
  csrfToken: string
}

/**
 * Typed effect context for Form Engine Developer Guide
 */
export type DeveloperGuideContext = EffectFunctionContext<
  DeveloperGuideData,
  DeveloperGuideAnswers,
  DeveloperGuideSession,
  DeveloperGuideState
>
