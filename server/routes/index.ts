import { Router } from 'express'

import type { Services } from '../services'
import { createNavigation, htmlBlocks } from '../utils/journeyUtils'
import { AuditEvent } from '../services/auditService'

export default function routes({ assessmentService, auditService }: Services): Router {
  const router = Router()

  router.get('/', async (_req, res) => {
    const currentTime = new Date().toLocaleString('en-GB', {
      dateStyle: 'full',
      timeStyle: 'long',
    })

    res.locals.form = { backLink: '/', navigation: createNavigation() }

    return res.render('pages/index', {
      currentTime,
      htmlBlocks,
    })
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

      await auditService.send(AuditEvent.CREATE_ASSESSMENT, {
        username: user.id,
        correlationId: req.id,
        assessmentUuid,
      })

      await auditService.send(AuditEvent.VIEW_ASSESSMENT, {
        username: user.id,
        correlationId: req.id,
        assessmentUuid,
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

  router.get('/sentence-plan-read/:uuid', async (req, res, next) => {
    try {
      const user = {
        id: res.locals.user.username,
        name: res.locals.user.displayName,
      }

      const assessmentUuid = req.params.uuid

      const sentencePlan = await assessmentService.query<'AssessmentVersion'>({
        type: 'AssessmentVersionQuery',
        assessmentUuid,
        user,
      })

      const timelineResult = await assessmentService.query<'AssessmentTimeline'>({
        type: 'AssessmentTimelineQuery',
        assessmentUuid,
        user,
      })

      const versions = await Promise.all(
        timelineResult.timeline.map(item =>
          assessmentService.query<'AssessmentVersion'>({
            type: 'AssessmentVersionQuery',
            timestamp: item.createdAt,
            assessmentUuid,
            user,
          }),
        ),
      )

      return res.render('pages/sentence-plan', {
        assessmentUuid,
        sentencePlan,
        timelineResult,
        versions,
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

      const sleep = () => {
        const end = Date.now() + 1000
        while (Date.now() < end) {
          // busy wait
        }
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

      sleep()

      // Create the Goals collection
      const { collectionUuid: goalsCollectionUuid } = await assessmentService.command<'CreateCollection'>({
        type: 'CreateCollectionCommand',
        name: 'GOALS',
        assessmentUuid,
        user,
      })

      sleep()

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

      sleep()

      // Create a Notes collection for the Goal
      const { collectionUuid: notesCollectionUuid } = await assessmentService.command<'CreateCollection'>({
        type: 'CreateCollectionCommand',
        name: 'NOTES',
        parentCollectionItemUuid: goalUuid,
        assessmentUuid,
        user,
      })

      sleep()

      // Create a Steps collection for the Goal
      const { collectionUuid: stepsCollectionUuid } = await assessmentService.command<'CreateCollection'>({
        type: 'CreateCollectionCommand',
        name: 'STEPS',
        parentCollectionItemUuid: goalUuid,
        assessmentUuid,
        user,
      })

      sleep()

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

      sleep()

      // Add another Step to the Goal
      await assessmentService.command<'AddCollectionItem'>({
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

      sleep()

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

      sleep()

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
        timeline: {
          type: 'GOAL_CREATED',
          data: {},
        },
        assessmentUuid,
        user,
      })

      sleep()

      // Move the second goal to the top
      await assessmentService.command<'ReorderCollectionItem'>({
        type: 'ReorderCollectionItemCommand',
        collectionItemUuid: goal2Uuid,
        index: 0,
        assessmentUuid,
        user,
      })

      sleep()

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

      const timelineResult = await assessmentService.query<'AssessmentTimeline'>({
        type: 'AssessmentTimelineQuery',
        assessmentUuid,
        user,
      })

      const versions = await Promise.all(
        timelineResult.timeline.map(item =>
          assessmentService.query<'AssessmentVersion'>({
            type: 'AssessmentVersionQuery',
            timestamp: item.createdAt,
            assessmentUuid,
            user,
          }),
        ),
      )

      return res.render('pages/sentence-plan', {
        assessmentUuid,
        sentencePlan,
        timelineResult,
        versions,
      })
    } catch (error) {
      return next(error)
    }
  })

  return router
}
