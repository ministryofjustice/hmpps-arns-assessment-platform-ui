import { Router } from 'express'

import type { Services } from '../services'

export default function routes({ assessmentService }: Services): Router {
  const router = Router()

  router.get('/', async (_req, res) => {
    const currentTime = new Date().toLocaleString('en-GB', {
      dateStyle: 'full',
      timeStyle: 'long',
    })

    return res.render('pages/index', { currentTime })
  })

  router.get('/assessment', async (req, res, next) => {
    try {
      const user = {
        id: res.locals.user.username,
        name: res.locals.user.displayName,
      }

      const { assessmentUuid, message } = await assessmentService.command<'CreateAssessment'>({
        type: 'CreateAssessmentCommand',
        formVersion: '1',
        properties: {},
        user,
      })

      const assessment = await assessmentService.query<'AssessmentVersion'>({
        type: 'AssessmentVersionQuery',
        assessmentUuid,
        user,
      })

      const currentTime = new Date().toLocaleString('en-GB', {
        dateStyle: 'full',
        timeStyle: 'long',
      })

      return res.render('pages/assessment', {
        assessmentUuid,
        message,
        assessment,
        currentTime,
      })
    } catch (error) {
      return next(error)
    }
  })

  router.get('/sentence-plan-demo', async (req, res, next) => {
    try {
      const user = {
        id: res.locals.user.username,
        name: res.locals.user.displayName,
      }

      // Create a new Plan
      const { assessmentUuid } = await assessmentService.command<'CreateAssessment'>({
        type: 'CreateAssessmentCommand',
        formVersion: '1',
        properties: {
          PUBLISHED_STATE: ['UNPUBLISHED'],
          STATUS: ['UNSIGNED'],
          AGREEMENT_STATUS: ['DRAFT'],
          AGREEMENT_DATE: [''],
          AGREEMENT_NOTES: [''],
        },
        user,
      })

      // Create the Goals collection
      const { collectionUuid: goalsCollectionUuid } = await assessmentService.command<'CreateCollection'>({
        type: 'CreateCollectionCommand',
        name: 'GOALS',
        assessmentUuid,
        user,
      })

      // Create a new Goal
      const { collectionItemUuid: goalUuid } = await assessmentService.command<'AddCollectionItem'>({
        type: 'AddCollectionItemCommand',
        collectionUuid: goalsCollectionUuid,
        properties: {
          STATUS: ['ACTIVE'],
          STATUS_DATE: ['2025-11-11T00:00:00'],
        },
        answers: {
          TITLE: ['I will find new ways to budget my money and keep to my income'],
          AREA_OF_NEED: ['FINANCES'],
          RELATED_AREAS_OF_NEED: ['ACCOMMODATION', 'THINKING_BEHAVIOURS_AND_ATTITUDES'],
          TARGET_DATE: ['2026-02-11T00:00:00'],
        },
        assessmentUuid,
        user,
      })

      // Create a Notes collection for the Goal
      const { collectionUuid: notesCollectionUuid } = await assessmentService.command<'CreateCollection'>({
        type: 'CreateCollectionCommand',
        name: 'NOTES',
        parentCollectionItemUuid: goalUuid,
        assessmentUuid,
        user,
      })

      // Create a Steps collection for the Goal
      const { collectionUuid: stepsCollectionUuid } = await assessmentService.command<'CreateCollection'>({
        type: 'CreateCollectionCommand',
        name: 'STEPS',
        parentCollectionItemUuid: goalUuid,
        assessmentUuid,
        user,
      })

      // Add a Step to the Goal
      const { collectionItemUuid: step1Uuid } = await assessmentService.command<'AddCollectionItem'>({
        type: 'AddCollectionItemCommand',
        collectionUuid: stepsCollectionUuid,
        properties: {
          STATUS_DATE: ['2025-11-11T00:00:00'],
        },
        answers: {
          STATUS: ['NOT_STARTED'],
          DESCRIPTION: ['Provide learning material'],
          ACTOR: ['Probation practitioner'],
        },
        assessmentUuid,
        user,
      })

      // Add another Step to the Goal
      const { collectionItemUuid: step2Uuid } = await assessmentService.command<'AddCollectionItem'>({
        type: 'AddCollectionItemCommand',
        collectionUuid: stepsCollectionUuid,
        properties: {
          STATUS_DATE: ['2025-11-11T00:00:00'],
        },
        answers: {
          STATUS: ['NOT_STARTED'],
          DESCRIPTION: ['Create a budget'],
          ACTOR: ['Person on probation'],
        },
        assessmentUuid,
        user,
      })

      // Mark Step1 as IN_PROGRESS and add a progress note to the Goal
      await assessmentService.commands([
        {
          type: 'UpdateCollectionItemAnswersCommand',
          collectionItemUuid: step1Uuid,
          added: {
            STATUS: ['IN_PROGRESS'],
          },
          removed: [],
          assessmentUuid,
          user,
        },
        {
          type: 'UpdateCollectionItemPropertiesCommand',
          collectionItemUuid: step1Uuid,
          added: {
            STATUS_DATE: ['2025-11-12T00:00:00'],
          },
          removed: [],
          assessmentUuid,
          user,
        },
        {
          type: 'AddCollectionItemCommand',
          collectionUuid: notesCollectionUuid,
          properties: {},
          answers: {
            DESCRIPTION: ['Person on probation is progressing well'],
          },
          assessmentUuid,
          user,
        },
      ])

      // Create another Goal
      const { collectionItemUuid: goal2Uuid } = await assessmentService.command<'AddCollectionItem'>({
        type: 'AddCollectionItemCommand',
        collectionUuid: goalsCollectionUuid,
        properties: {
          STATUS: ['ACTIVE'],
          STATUS_DATE: ['2025-11-11T00:00:00'],
        },
        answers: {
          TITLE: ['Top priority goal'],
          AREA_OF_NEED: ['FINANCES'],
          RELATED_AREAS_OF_NEED: [],
          TARGET_DATE: ['2026-02-11T00:00:00'],
        },
        assessmentUuid,
        user,
      })

      // Move the second goal to the top
      await assessmentService.command<'ReorderCollectionItem'>({
        type: 'ReorderCollectionItemCommand',
        collectionItemUuid: goal2Uuid,
        index: 0,
        assessmentUuid,
        user,
      })

      // Agree the Plan
      await assessmentService.command<'UpdateAssessmentProperties'>({
        type: 'UpdateAssessmentPropertiesCommand',
        added: {
          AGREEMENT_STATUS: ['AGREED'],
          AGREEMENT_NOTES: ['AGREED'],
        },
        removed: [],
        timeline: {
          type: 'PLAN_AGREED',
          data: {
            details: 'Plan agreed by X and Y on Z',
            status: 'AGREED',
          },
        },
        assessmentUuid,
        user,
      })

      const sentencePlan = await assessmentService.query<'AssessmentVersion'>({
        type: 'AssessmentVersionQuery',
        assessmentUuid,
        user,
      })

      const currentTime = new Date().toLocaleString('en-GB', {
        dateStyle: 'full',
        timeStyle: 'long',
      })

      return res.render('pages/sentence-plan', {
        assessmentUuid,
        sentencePlan,
        currentTime,
      })
    } catch (error) {
      return next(error)
    }
  })

  return router
}
