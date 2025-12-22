import { defineEffectsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
import EffectFunctionContext from '@form-engine/core/ast/thunks/EffectFunctionContext'
import { ValueExpr } from '@form-engine/form/types/expressions.type'

/**
 * Effects for Form Engine Developer Guide
 *
 * These effects support the interactive demonstrations in the guide.
 * No backend API integration - just session-based storage for demo purposes.
 */
export const { effects: DeveloperGuideEffects, createRegistry: createDeveloperGuideEffectsRegistry } =
  defineEffectsWithDeps<object>()({
    /**
     * Initialize the guide session
     * Sets up demo data used in various concept demonstrations
     */
    initializeSession: _deps => (context: EffectFunctionContext) => {
      const session = context.getSession()

      if (!session.guideInitialized) {
        session.guideInitialized = true
        session.startedAt = new Date().toISOString()
        session.conceptsVisited = []
      }

      // Make CSRF token available to form blocks via Data('csrfToken')
      const csrfToken = context.getState('csrfToken')
      if (csrfToken) {
        context.setData('csrfToken', csrfToken)
      }

      context.setData('guide', {
        startedAt: session.startedAt,
        conceptsVisited: session.conceptsVisited,
      })

      context.setData('demoItems', [
        { id: 'item_1', name: 'First Item', status: 'active' },
        { id: 'item_2', name: 'Second Item', status: 'pending' },
        { id: 'item_3', name: 'Third Item', status: 'complete' },
      ])

      // ========================================
      // Demo data for Collection examples
      // ========================================

      // Simple list items
      context.setData('simpleListItems', [
        { name: 'Complete form-engine tutorial' },
        { name: 'Build a demo registration form' },
        { name: 'Add validation rules' },
        { name: 'Implement hub-and-spoke pattern' },
      ])

      // Team members for basic list
      context.setData('teamMembers', [
        { name: 'John Smith', email: 'john.smith@example.com', role: 'Developer' },
        { name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Designer' },
        { name: 'Mike Brown', email: 'mike.b@example.com', role: 'Manager' },
      ])

      // Table rows data
      context.setData('tableRows', [
        { name: 'Alice Johnson', role: 'Lead Developer', status: 'active' },
        { name: 'Bob Smith', role: 'Designer', status: 'active' },
        { name: 'Carol Williams', role: 'Product Manager', status: 'away' },
        { name: 'David Brown', role: 'QA Engineer', status: 'active' },
      ])

      // Expenses for table example
      context.setData('expenses', [
        { category: 'Travel', description: 'Train tickets to London', amount: '45.50' },
        { category: 'Supplies', description: 'Office stationery', amount: '23.99' },
        { category: 'Software', description: 'Monthly subscription', amount: '12.00' },
        { category: 'Training', description: 'Online course', amount: '89.00' },
      ])

      // Nested collections: teams with members
      context.setData('teams', [
        {
          name: 'Frontend Team',
          members: [
            { name: 'Alice', skill: 'React' },
            { name: 'Bob', skill: 'Vue' },
          ],
        },
        {
          name: 'Backend Team',
          members: [
            { name: 'Charlie', skill: 'Node.js' },
            { name: 'Diana', skill: 'Python' },
            { name: 'Eve', skill: 'Java' },
          ],
        },
      ])

      // Categories with tasks (nested)
      context.setData('categories', [
        {
          name: 'Frontend',
          color: 'blue',
          tasks: [
            { name: 'Build login form', priority: 'high' },
            { name: 'Style dashboard', priority: 'medium' },
          ],
        },
        {
          name: 'Backend',
          color: 'purple',
          tasks: [
            { name: 'Create API endpoints', priority: 'high' },
            { name: 'Set up database', priority: 'high' },
            { name: 'Write tests', priority: 'low' },
          ],
        },
      ])

      // Tasks with status and priority
      context.setData('tasks', [
        { task: 'Review documentation', status: 'completed', priority: 'low' },
        { task: 'Fix login bug', status: 'in_progress', priority: 'high' },
        { task: 'Write unit tests', status: 'pending', priority: 'medium' },
        { task: 'Deploy to staging', status: 'completed', priority: 'high' },
      ])

      // Search results for fallback example
      context.setData('searchResults', [
        { title: 'Form Engine Guide', url: '/guide' },
        { title: 'API Documentation', url: '/api' },
        { title: 'Examples Gallery', url: '/examples' },
      ])

      // Summary cards data
      context.setData('articles', [
        {
          title: 'Form Engine Guide',
          description: 'Learn to build forms with the form-engine',
          status: 'published',
          views: 1247,
        },
        {
          title: 'Validation Patterns',
          description: 'Common validation rules and best practices',
          status: 'draft',
          views: 523,
        },
        {
          title: 'Component Library',
          description: 'Available GOV.UK and MOJ components',
          status: 'published',
          views: 892,
        },
      ])

      // Editable team members for dynamic fields example
      context.setData('editableTeamMembers', [
        { name: 'Alice', role: 'Lead Developer' },
        { name: 'Bob', role: 'Designer' },
        { name: 'Charlie', role: 'Tester' },
      ])
    },

    /**
     * Track which concept was visited
     * Used to show progress through the guide
     */
    trackConceptVisit: _deps => (context: EffectFunctionContext, conceptName: string) => {
      const session = context.getSession()

      if (!session.conceptsVisited) {
        session.conceptsVisited = []
      }

      if (!session.conceptsVisited.includes(conceptName)) {
        session.conceptsVisited.push(conceptName)
      }

      context.setData('guide', {
        startedAt: session.startedAt,
        conceptsVisited: session.conceptsVisited,
      })
    },

    // ========================================
    // Collections Playground Effects
    // ========================================

    /**
     * Initialize playground items for the collections CRUD demo
     * Creates sample items if none exist in session
     */
    initializePlaygroundItems: _deps => (context: EffectFunctionContext) => {
      const session = context.getSession()

      if (!session.playgroundItems) {
        session.playgroundItems = [
          {
            id: 'task_1',
            name: 'Review documentation',
            description: 'Go through the form-engine docs',
            category: 'learning',
            priority: 'high',
          },
          {
            id: 'task_2',
            name: 'Build a demo form',
            description: 'Create a sample registration form',
            category: 'development',
            priority: 'medium',
          },
          {
            id: 'task_3',
            name: 'Write tests',
            description: 'Add unit tests for validation logic',
            category: 'development',
            priority: 'low',
          },
        ]
      }

      context.setData('playgroundItems', session.playgroundItems)

      // Make CSRF token available
      const csrfToken = context.getState('csrfToken')

      if (csrfToken) {
        context.setData('csrfToken', csrfToken)
      }
    },

    /**
     * Load a specific playground item for editing
     * Reads itemId from URL params and populates form answers
     */
    loadPlaygroundItem: _deps => (context: EffectFunctionContext) => {
      const itemId = context.getRequestParam('itemId')
      const session = context.getSession()
      const items = session.playgroundItems || []

      if (itemId === 'new') {
        // Initialize empty form for new item
        context.setAnswer('taskName', '')
        context.setAnswer('taskDescription', '')
        context.setAnswer('taskCategory', '')
        context.setAnswer('taskPriority', '')
        context.setData('isNewItem', true)
      } else {
        // Find existing item and populate form
        const item = items.find((i: { id: string }) => i.id === itemId)

        if (item) {
          context.setAnswer('taskName', item.name || '')
          context.setAnswer('taskDescription', item.description || '')
          context.setAnswer('taskCategory', item.category || '')
          context.setAnswer('taskPriority', item.priority || '')
          context.setData('isNewItem', false)
        } else {
          context.setData('itemNotFound', true)
        }
      }
    },

    /**
     * Save playground item changes back to session
     * Handles both new items and updates to existing items
     */
    savePlaygroundItem: _deps => (context: EffectFunctionContext) => {
      const itemId = context.getRequestParam('itemId')
      const session = context.getSession()
      const items = session.playgroundItems || []

      const itemData = {
        name: context.getAnswer('taskName') as string,
        description: context.getAnswer('taskDescription') as string,
        category: context.getAnswer('taskCategory') as string,
        priority: context.getAnswer('taskPriority') as string,
      }

      if (itemId === 'new') {
        // Create new item with generated ID
        const newItem = {
          id: `task_${Date.now()}`,
          ...itemData,
        }

        session.playgroundItems = [...items, newItem]
      } else {
        // Update existing item
        session.playgroundItems = items.map((item: { id: string }) =>
          item.id === itemId ? { ...item, ...itemData } : item,
        )
      }

      context.setData('playgroundItems', session.playgroundItems)
    },

    /**
     * Remove a playground item from the session
     * @param itemId - The ID of the item to remove
     */
    removePlaygroundItem: _deps => (context: EffectFunctionContext, itemId: ValueExpr) => {
      const session = context.getSession()
      const items = session.playgroundItems || []

      session.playgroundItems = items.filter((item: { id: string }) => item.id !== itemId)
      context.setData('playgroundItems', session.playgroundItems)
    },

    /**
     * Reset playground items to default sample data
     * Clears existing items and restores the initial set
     */
    resetPlaygroundItems: _deps => (context: EffectFunctionContext) => {
      const session = context.getSession()

      session.playgroundItems = [
        {
          id: 'task_1',
          name: 'Review documentation',
          description: 'Go through the form-engine docs',
          category: 'learning',
          priority: 'high',
        },
        {
          id: 'task_2',
          name: 'Build a demo form',
          description: 'Create a sample registration form',
          category: 'development',
          priority: 'medium',
        },
        {
          id: 'task_3',
          name: 'Write tests',
          description: 'Add unit tests for validation logic',
          category: 'development',
          priority: 'low',
        },
      ]

      context.setData('playgroundItems', session.playgroundItems)
    },

    // ========================================
    // Inline Collection Effects
    // ========================================

    /**
     * Initialize inline steps collection with sample data
     * Restores answers from session so saved values display on GET requests
     * On POST requests, these values get overridden by POST data during AST evaluation
     */
    initializeInlineSteps: _deps => (context: EffectFunctionContext) => {
      const session = context.getSession()

      if (!session.inlineSteps) {
        session.inlineSteps = [
          { id: 'step_1', who: '', action: '' },
          { id: 'step_2', who: '', action: '' },
        ]
      }

      context.setData('inlineSteps', session.inlineSteps)

      // Make CSRF token available
      const csrfToken = context.getState('csrfToken')

      if (csrfToken) {
        context.setData('csrfToken', csrfToken)
      }
    },

    /**
     * Add a new empty step to the inline collection
     */
    addInlineStep: _deps => (context: EffectFunctionContext) => {
      const session = context.getSession()
      const steps = session.inlineSteps || []

      // Save current POST values
      steps.forEach((step: { id: string; who: string; action: string }, i: number) => {
        step.who = String(context.getAnswer(`who_${i}`) ?? '')
        step.action = String(context.getAnswer(`action_${i}`) ?? '')
      })

      // Add new empty item
      steps.push({ id: `step_${Date.now()}`, who: '', action: '' })

      session.inlineSteps = steps
      context.setData('inlineSteps', session.inlineSteps)
    },

    /**
     * Remove a step from the inline collection by index
     * If it's the last item, clear it instead of removing (always keep at least one)
     */
    removeInlineStep: _deps => (context: EffectFunctionContext, index: number) => {
      const session = context.getSession()
      const steps = session.inlineSteps || []

      // Save current POST values
      steps.forEach((step: { id: string; who: string; action: string }, i: number) => {
        step.who = String(context.getAnswer(`who_${i}`) ?? '')
        step.action = String(context.getAnswer(`action_${i}`) ?? '')
      })

      if (steps.length <= 1) {
        // Clear the last item instead of removing it
        steps[0] = { id: 'step_1', who: '', action: '' }
      } else {
        steps.splice(index, 1)
      }

      session.inlineSteps = steps
      context.setData('inlineSteps', session.inlineSteps)
    },

    /**
     * Save inline step field values back to session
     * Called on form submission to persist the entered data
     */
    saveInlineSteps: _deps => (context: EffectFunctionContext) => {
      const session = context.getSession()
      const steps = session.inlineSteps || []

      steps.forEach((step: { id: string; who: string; action: string }, index: number) => {
        step.who = String(context.getAnswer(`who_${index}`) ?? '')
        step.action = String(context.getAnswer(`action_${index}`) ?? '')
      })
    },
  })
