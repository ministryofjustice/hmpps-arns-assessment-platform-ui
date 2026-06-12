import { defineEffectFunctions, EffectFunctionExpr } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffectContext, TieringAssessmentEffectsDeps } from './types'
import { RiskScoreInput } from '../../../interfaces/risk-actuarial-api/riskScores'

/**
 * Shared effects used by every pattern demo. Committed answers are persisted
 * through the injected FormDataStore (Redis-backed). Drafts live in the
 * express session under `session.patternDrafts[patternCode]` so they remain
 * isolated from committed state.
 */
export interface PatternEffectShape {
  /** Copies previously stored answers for this pattern into the form context on access. */
  LoadAnswers: (patternCode: string) => EffectFunctionExpr

  /** Copies previously stored draft answers for this pattern into the form context on access. */
  LoadDraftAnswers: (patternCode: string) => EffectFunctionExpr

  /** Persists the current answers into the session under the pattern's code. */
  SaveAnswers: (patternCode: string) => EffectFunctionExpr

  /** Persists the current answers into the session as a draft, kept separately from committed answers. */
  SaveDraftAnswers: (patternCode: string) => EffectFunctionExpr

  /** Records in the session whether this pattern has been submitted. */
  SaveSubmitStateToSession: (patternCode: string, submitted: boolean) => EffectFunctionExpr

  /** Clears stored answers for this pattern (used after confirmation / reset). */
  ClearAnswers: (patternCode: string) => EffectFunctionExpr

  /** Clears draft answers for this pattern (used after committing drafts to the store). */
  ClearDraftAnswers: (patternCode: string) => EffectFunctionExpr

  /** Writes a fixed set of example answers into the session and form context, for demos that need a pre-populated starting state. */
  SeedAnswers: (patternCode: string, answers: Record<string, unknown>) => EffectFunctionExpr

  /** Writes a fixed set of example answers into the session draft namespace and form context, for demos that need a pre-populated in-progress state. */
  SeedDraftAnswers: (patternCode: string, answers: Record<string, unknown>) => EffectFunctionExpr

  /** Bundles temporary field answers into an object and appends it to a collection array. Clears the temporary fields afterwards. */
  AddItemToCollection: (collectionCode: string, fieldCodes: string[]) => EffectFunctionExpr

  /** Removes an item from a collection array by its index, read from the 'remove' query parameter. */
  RemoveItemFromCollection: (collectionCode: string) => EffectFunctionExpr

  /** Reads the ':index' route parameter, extracts the item at that position from the collection, and sets each field as Data for display on a confirmation page. */
  LoadItemForDelete: (collectionCode: string, fieldCodes: string[]) => EffectFunctionExpr

  /** Reads the ':index' route parameter and removes the item at that position from the collection. */
  DeleteItemFromCollection: (collectionCode: string) => EffectFunctionExpr

  /** Sets a single answer value in the form context. Useful for status tracking or computed values that aren't form fields. */
  SetAnswer: (code: string, value: unknown) => EffectFunctionExpr

  /** Reads the ':index' route parameter, extracts the item at that position from the collection, sets each field as an answer, and stores the edit index in the session. */
  LoadItemForEdit: (patternCode: string, collectionCode: string, fieldCodes: string[]) => EffectFunctionExpr

  /** Reads the stored edit index from the session, bundles the current field answers into an object, and replaces the item at that index in the collection. Clears the stored edit index afterwards. */
  EditItemInCollection: (patternCode: string, collectionCode: string, fieldCodes: string[]) => EffectFunctionExpr

  /** Loads a repeating collection from the session, sets it as Data for the iterator, and restores indexed field answers. */
  InitializeRepeatingFieldsets: (
    patternCode: string,
    collectionCode: string,
    fieldCodes: string[],
  ) => EffectFunctionExpr

  /** Saves current indexed field values to the session collection, appends an empty item, and restores answers with new indices. */
  AddRepeatingItem: (patternCode: string, collectionCode: string, fieldCodes: string[]) => EffectFunctionExpr

  /** Saves current indexed field values, removes the item whose index matches the POST action value, and re-indexes answers. */
  RemoveRepeatingItem: (patternCode: string, collectionCode: string, fieldCodes: string[]) => EffectFunctionExpr

  /** Reads current indexed field values into the session collection for persistence across requests. */
  SaveRepeatingItems: (patternCode: string, collectionCode: string, fieldCodes: string[]) => EffectFunctionExpr

  calculateRiskActuarialScores: () => EffectFunctionExpr
}

export const { effects: TieringAssessmentEffects, implementations: TieringAssessmentEffectsImplementations } =
  defineEffectFunctions<PatternEffectShape, TieringAssessmentEffectsDeps>({
    LoadAnswers:
      (deps: TieringAssessmentEffectsDeps) => async (context: TieringAssessmentEffectContext, patternCode: string) => {
        const sessionId = context.getSession()?.id

        if (!sessionId) {
          return
        }

        const stored = await deps.formDataStore.get(sessionId, patternCode)

        if (!stored) {
          return
        }

        for (const [code, value] of Object.entries(stored)) {
          if (!context.hasAnswer(code)) {
            context.setAnswer(code, value)
          }
        }
      },

    LoadDraftAnswers: () => (context: TieringAssessmentEffectContext, patternCode: string) => {
      const stored = context.getSession()?.patternDrafts?.[patternCode]

      if (!stored) {
        return
      }

      for (const [code, value] of Object.entries(stored)) {
        if (!context.hasAnswer(code)) {
          context.setAnswer(code, value)
        }
      }
    },

    SaveAnswers:
      (deps: TieringAssessmentEffectsDeps) => async (context: TieringAssessmentEffectContext, patternCode: string) => {
        const sessionId = context.getSession()?.id

        if (!sessionId) {
          return
        }

        const fieldsToClear = context.getFieldsToClear()

        for (const field of fieldsToClear) {
          context.clearAnswer(field)
        }

        await deps.formDataStore.set(sessionId, patternCode, context.getAllAnswers())
      },

    SaveDraftAnswers: () => (context: TieringAssessmentEffectContext, patternCode: string) => {
      const session = context.getSession()

      if (!session) {
        return
      }

      if (!session.patternDrafts) {
        session.patternDrafts = {}
      }

      session.patternDrafts[patternCode] = {
        ...session.patternDrafts[patternCode],
        ...context.getAllAnswers(),
      }
    },

    SaveSubmitStateToSession:
      () => (context: TieringAssessmentEffectContext, patternCode: string, submitted: boolean) => {
        const session = context.getSession()

        if (!session) {
          return
        }

        if (!session.patternSubmitted) {
          session.patternSubmitted = {}
        }

        session.patternSubmitted[patternCode] = submitted
      },

    ClearAnswers:
      (deps: TieringAssessmentEffectsDeps) => async (context: TieringAssessmentEffectContext, patternCode: string) => {
        const sessionId = context.getSession()?.id

        if (!sessionId) {
          return
        }

        await deps.formDataStore.delete(sessionId, patternCode)

        for (const key of Object.keys(context.getAllAnswers())) {
          context.clearAnswer(key)
        }
      },

    ClearDraftAnswers: () => {
      return (context: TieringAssessmentEffectContext, patternCode: string) => {
        const session = context.getSession()

        if (session?.patternDrafts) {
          delete session.patternDrafts[patternCode]
        }

        for (const key of Object.keys(context.getAllAnswers())) {
          context.clearAnswer(key)
        }
      }
    },

    SeedAnswers:
      (deps: TieringAssessmentEffectsDeps) =>
      async (context: TieringAssessmentEffectContext, patternCode: string, answers: Record<string, unknown>) => {
        const sessionId = context.getSession()?.id

        if (sessionId) {
          await deps.formDataStore.set(sessionId, patternCode, answers)
        }

        Object.entries(answers).forEach(([code, value]) => context.setAnswer(code, value))
      },

    SeedDraftAnswers:
      () => (context: TieringAssessmentEffectContext, patternCode: string, answers: Record<string, unknown>) => {
        const session = context.getSession()

        if (session) {
          if (!session.patternDrafts) {
            session.patternDrafts = {}
          }

          session.patternDrafts[patternCode] = {
            ...session.patternDrafts[patternCode],
            ...answers,
          }
        }

        for (const [code, value] of Object.entries(answers)) {
          context.setAnswer(code, value)
        }
      },

    AddItemToCollection:
      () => (context: TieringAssessmentEffectContext, collectionCode: string, fieldCodes: string[]) => {
        const item: Record<string, unknown> = {}

        for (const code of fieldCodes) {
          const value = context.getAnswer(code)

          if (value !== undefined) {
            item[code] = value
          }
        }

        const collection = (context.getAnswer(collectionCode) ?? []) as unknown[]
        context.setAnswer(collectionCode, [...collection, item])

        for (const code of fieldCodes) {
          context.setAnswer(code, undefined)
        }
      },

    RemoveItemFromCollection: () => (context: TieringAssessmentEffectContext, collectionCode: string) => {
      const indexStr = context.getQueryParam('remove')

      if (indexStr === undefined) {
        return
      }

      const index = parseInt(String(indexStr), 10)
      const collection = (context.getAnswer(collectionCode) ?? []) as unknown[]

      if (index >= 0 && index < collection.length) {
        const updated = [...collection]
        updated.splice(index, 1)
        context.setAnswer(collectionCode, updated)
      }
    },

    LoadItemForDelete:
      () => (context: TieringAssessmentEffectContext, collectionCode: string, fieldCodes: string[]) => {
        const indexStr = context.getRequestParam('index')

        if (indexStr === undefined) {
          return
        }

        const index = parseInt(indexStr, 10)
        const collection = (context.getAnswer(collectionCode) ?? []) as Record<string, unknown>[]

        if (Number.isNaN(index) || index < 0 || index >= collection.length) {
          return
        }

        const item = collection[index]

        for (const code of fieldCodes) {
          if (item[code] !== undefined) {
            context.setData(code, item[code])
          }
        }
      },

    DeleteItemFromCollection: () => (context: TieringAssessmentEffectContext, collectionCode: string) => {
      const indexStr = context.getRequestParam('index')

      if (indexStr === undefined) {
        return
      }

      const index = parseInt(indexStr, 10)
      const collection = (context.getAnswer(collectionCode) ?? []) as unknown[]

      if (Number.isNaN(index) || index < 0 || index >= collection.length) {
        return
      }

      const updated = [...collection]
      updated.splice(index, 1)
      context.setAnswer(collectionCode, updated)
    },

    SetAnswer: () => (context: TieringAssessmentEffectContext, code: string, value: unknown) => {
      context.setAnswer(code, value)
    },

    LoadItemForEdit:
      () =>
      (context: TieringAssessmentEffectContext, patternCode: string, collectionCode: string, fieldCodes: string[]) => {
        const indexStr = context.getRequestParam('index')

        if (indexStr === undefined) {
          return
        }

        const index = parseInt(indexStr, 10)
        const collection = (context.getAnswer(collectionCode) ?? []) as Record<string, unknown>[]

        if (Number.isNaN(index) || index < 0 || index >= collection.length) {
          return
        }

        const item = collection[index]

        for (const code of fieldCodes) {
          if (item[code] !== undefined) {
            context.setAnswer(code, item[code])
          }
        }

        const session = context.getSession()

        if (session) {
          if (!session.patternDrafts) {
            session.patternDrafts = {}
          }

          if (!session.patternDrafts[patternCode]) {
            session.patternDrafts[patternCode] = {}
          }

          session.patternDrafts[patternCode].editingIndex = index
        }
      },

    InitializeRepeatingFieldsets:
      () =>
      (context: TieringAssessmentEffectContext, patternCode: string, collectionCode: string, fieldCodes: string[]) => {
        const stored = context.getSession()?.patternDrafts?.[patternCode]
        const collection = (stored?.[collectionCode] ?? []) as Record<string, unknown>[]

        if (collection.length === 0) {
          return
        }

        context.setData(collectionCode, collection)

        collection.forEach((item, index) => {
          for (const code of fieldCodes) {
            context.setAnswer(`${code}_${index}`, (item[code] as string) ?? '')
          }
        })
      },

    AddRepeatingItem:
      () =>
      (context: TieringAssessmentEffectContext, patternCode: string, collectionCode: string, fieldCodes: string[]) => {
        const session = context.getSession()

        if (!session) {
          return
        }

        if (!session.patternDrafts) {
          session.patternDrafts = {}
        }

        if (!session.patternDrafts[patternCode]) {
          session.patternDrafts[patternCode] = {}
        }

        const stored = session.patternDrafts[patternCode]
        const collection = (stored[collectionCode] ?? context.getData(collectionCode) ?? []) as Record<
          string,
          unknown
        >[]

        const updated = collection.map((item, index) => {
          const merged = { ...item }

          for (const code of fieldCodes) {
            merged[code] = context.getAnswer(`${code}_${index}`) ?? item[code]
          }

          return merged
        })

        updated.push(Object.fromEntries(fieldCodes.map(code => [code, ''])))
        stored[collectionCode] = updated

        context.setData(collectionCode, updated)

        updated.forEach((item, index) => {
          for (const code of fieldCodes) {
            context.setAnswer(`${code}_${index}`, (item[code] as string) ?? '')
          }
        })
      },

    RemoveRepeatingItem:
      () =>
      (context: TieringAssessmentEffectContext, patternCode: string, collectionCode: string, fieldCodes: string[]) => {
        const session = context.getSession()

        if (!session?.patternDrafts?.[patternCode]) {
          return
        }

        const stored = session.patternDrafts[patternCode]
        const collection = (stored[collectionCode] ?? context.getData(collectionCode) ?? []) as Record<
          string,
          unknown
        >[]

        const actionValue = context.getPostData('action') as string
        const indexStr = actionValue?.replace('remove_', '')
        const index = parseInt(indexStr, 10)

        if (Number.isNaN(index) || index < 0 || index >= collection.length) {
          return
        }

        let updated = collection.map((item, i) => {
          const merged = { ...item }

          for (const code of fieldCodes) {
            merged[code] = context.getAnswer(`${code}_${i}`) ?? item[code]
          }

          return merged
        })

        updated = [...updated.slice(0, index), ...updated.slice(index + 1)]

        stored[collectionCode] = updated

        context.setData(collectionCode, updated)

        updated.forEach((item, i) => {
          for (const code of fieldCodes) {
            context.setAnswer(`${code}_${i}`, (item[code] as string) ?? '')
          }
        })
      },

    SaveRepeatingItems:
      () =>
      (context: TieringAssessmentEffectContext, patternCode: string, collectionCode: string, fieldCodes: string[]) => {
        const session = context.getSession()

        if (!session) {
          return
        }

        if (!session.patternDrafts) {
          session.patternDrafts = {}
        }

        if (!session.patternDrafts[patternCode]) {
          session.patternDrafts[patternCode] = {}
        }

        const stored = session.patternDrafts[patternCode]
        const collection = (stored[collectionCode] ?? context.getData(collectionCode) ?? []) as Record<
          string,
          unknown
        >[]

        stored[collectionCode] = collection.map((item, index) => {
          const merged = { ...item }

          for (const code of fieldCodes) {
            merged[code] = context.getAnswer(`${code}_${index}`) ?? item[code]
          }

          return merged
        })
      },

    EditItemInCollection:
      () =>
      (context: TieringAssessmentEffectContext, patternCode: string, collectionCode: string, fieldCodes: string[]) => {
        const session = context.getSession()
        const editingIndex = session?.patternDrafts?.[patternCode]?.editingIndex

        if (editingIndex === undefined) {
          return
        }

        const index = Number(editingIndex)
        const collection = (context.getAnswer(collectionCode) ?? []) as Record<string, unknown>[]

        if (index < 0 || index >= collection.length) {
          return
        }

        const item: Record<string, unknown> = {}

        for (const code of fieldCodes) {
          const value = context.getAnswer(code)

          if (value !== undefined) {
            item[code] = value
          }
        }

        const updated = [...collection]
        updated[index] = item
        context.setAnswer(collectionCode, updated)

        for (const code of fieldCodes) {
          context.setAnswer(code, undefined)
        }

        if (session?.patternDrafts?.[patternCode]) {
          delete session.patternDrafts[patternCode].editingIndex
        }
      },
    calculateRiskActuarialScores:
      (deps: TieringAssessmentEffectsDeps) => async (context: TieringAssessmentEffectContext) => {
        const riskScoreInput: RiskScoreInput = {
          gender: context.getAnswer('gender') as string,
          dateOfBirth: context.getAnswer('date-of-birth') as string,
          dateOfCurrentConviction: context.getAnswer('date-of-current-conviction') as string,
          dateAtStartOfFollowupCalculated: context.getAnswer('date-at-start-of-followup') as string,
          totalNumberOfSanctionsForAllOffences: Number(context.getAnswer('total-number-of-sanctions') as string),
          ageAtFirstSanction: Number(context.getAnswer('age-at-first-sanction')),
          currentOffenceCode: context.getAnswer('offence-code') as string,
        }
        const riskScores = await deps.riskActuarialApi.getRiskScores(riskScoreInput)
        context.setAnswer('risk-scores-ogrs3', riskScores.actuarialPredictors.allPredictor.output)
        context.setAnswer('risk-scores-ogrs3-errors', JSON.stringify(riskScores.actuarialPredictors.allPredictor.validationErrors))
      },
  })
