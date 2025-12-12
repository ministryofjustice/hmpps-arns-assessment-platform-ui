import { defineEffectsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
import EffectFunctionContext from '@form-engine/core/ast/thunks/EffectFunctionContext'

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

      context.setData('guide', {
        startedAt: session.startedAt,
        conceptsVisited: session.conceptsVisited,
      })

      context.setData('demoItems', [
        { id: 'item_1', name: 'First Item', status: 'active' },
        { id: 'item_2', name: 'Second Item', status: 'pending' },
        { id: 'item_3', name: 'Third Item', status: 'complete' },
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
  })
