import { Router } from 'express'
import type { Services } from '../../services'

export default function routes({ assessmentService }: Services): Router {
  const router = Router()

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

      const goalsUuid = sentencePlan.collections[0].uuid
      const goalUuid = sentencePlan.collections[0].items[1].uuid

      const goalsResult = await assessmentService.query<'Collection'>({
        type: 'CollectionQuery',
        collectionUuid: goalsUuid,
        depth: 0,
        assessmentUuid,
        user,
      })

      const goalsWithSteps = await assessmentService.query<'Collection'>({
        type: 'CollectionQuery',
        collectionUuid: goalsUuid,
        depth: 1,
        assessmentUuid,
        user,
      })

      const goalResult = await assessmentService.query<'CollectionItem'>({
        type: 'CollectionItemQuery',
        collectionItemUuid: goalUuid,
        depth: 0,
        assessmentUuid,
        user,
      })

      const goalWithSteps = await assessmentService.query<'CollectionItem'>({
        type: 'CollectionItemQuery',
        collectionItemUuid: goalUuid,
        depth: 1,
        assessmentUuid,
        user,
      })

      const stepsTimelineResult = await assessmentService.query<'AssessmentTimeline'>({
        type: 'AssessmentTimelineQuery',
        timelineTypes: ['STEP_ADDED'],
        assessmentUuid,
        user,
      })

      const goalsWithStepsPointInTime = await assessmentService.query<'Collection'>({
        type: 'CollectionQuery',
        collectionUuid: goalsUuid,
        depth: 1,
        timestamp: stepsTimelineResult.timeline[0].createdAt,
        assessmentUuid,
        user,
      })

      const goalWithStepsPointInTime = await assessmentService.query<'CollectionItem'>({
        type: 'CollectionItemQuery',
        collectionItemUuid: goalUuid,
        depth: 1,
        timestamp: stepsTimelineResult.timeline[0].createdAt,
        assessmentUuid,
        user,
      })

      const timelinePointInTime = await assessmentService.query<'AssessmentTimeline'>({
        type: 'AssessmentTimelineQuery',
        timestamp: timelineResult.timeline[1].createdAt,
        assessmentUuid,
        user,
      })

      return res.render('pages/sentence-plan', {
        assessmentUuid,
        sentencePlan,
        timelineResult,
        versions,
        goalsResult,
        goalsWithSteps,
        goalsWithStepsPointInTime,
        goalResult,
        goalWithSteps,
        goalWithStepsPointInTime,
        stepsTimelineResult,
        timelinePointInTime,
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
          PUBLISHED_STATE: { type: 'SingleValue', value: 'UNPUBLISHED' },
          STATUS: { type: 'SingleValue', value: 'UNSIGNED' },
          AGREEMENT_STATUS: { type: 'SingleValue', value: 'DRAFT' },
          AGREEMENT_DATE: { type: 'SingleValue', value: '' },
          AGREEMENT_NOTES: { type: 'SingleValue', value: '' },
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
          STATUS: { type: 'SingleValue', value: 'ACTIVE' },
          STATUS_DATE: { type: 'SingleValue', value: '2025-11-11T00:00:00' },
        },
        answers: {
          TITLE: { type: 'SingleValue', value: 'I will find new ways to budget my money and keep to my income' },
          AREA_OF_NEED: { type: 'SingleValue', value: 'FINANCES' },
          RELATED_AREAS_OF_NEED: { type: 'MultiValue', values: ['ACCOMMODATION', 'THINKING_BEHAVIOURS_AND_ATTITUDES'] },
          TARGET_DATE: { type: 'SingleValue', value: '2026-02-11T00:00:00' },
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
          STATUS_DATE: { type: 'SingleValue', value: '2025-11-11T00:00:00' },
        },
        answers: {
          STATUS: { type: 'SingleValue', value: 'NOT_STARTED' },
          DESCRIPTION: { type: 'SingleValue', value: 'Provide learning material' },
          ACTOR: { type: 'SingleValue', value: 'Probation practitioner' },
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
          STATUS_DATE: { type: 'SingleValue', value: '2025-11-11T00:00:00' },
        },
        answers: {
          STATUS: { type: 'SingleValue', value: 'NOT_STARTED' },
          DESCRIPTION: { type: 'SingleValue', value: 'Create a budget' },
          ACTOR: { type: 'SingleValue', value: 'Person on probation' },
        },
        timeline: {
          type: 'STEP_ADDED',
          data: {},
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
            STATUS: { type: 'SingleValue', value: 'IN_PROGRESS' },
          },
          removed: [],
          assessmentUuid,
          user,
        },
        {
          type: 'UpdateCollectionItemPropertiesCommand',
          collectionItemUuid: step1Uuid,
          added: {
            STATUS_DATE: { type: 'SingleValue', value: '2025-11-12T00:00:00' },
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
            DESCRIPTION: { type: 'SingleValue', value: 'Person on probation is progressing well' },
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
          STATUS: { type: 'SingleValue', value: 'ACTIVE' },
          STATUS_DATE: { type: 'SingleValue', value: '2025-11-11T00:00:00' },
        },
        answers: {
          TITLE: { type: 'SingleValue', value: 'Top priority goal' },
          AREA_OF_NEED: { type: 'SingleValue', value: 'FINANCES' },
          RELATED_AREAS_OF_NEED: { type: 'MultiValue', values: [] },
          TARGET_DATE: { type: 'SingleValue', value: '2026-02-11T00:00:00' },
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
          AGREEMENT_STATUS: { type: 'SingleValue', value: 'AGREED' },
          AGREEMENT_NOTES: { type: 'SingleValue', value: 'AGREED' },
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

      // Update the form version
      await assessmentService.command<'Group'>({
        type: 'GroupCommand',
        commands: [
          {
            type: 'UpdateAssessmentPropertiesCommand',
            added: {
              SOME_PROP: { type: 'SingleValue', value: 'new val' },
            },
            removed: [],
            assessmentUuid,
            user,
          },
          {
            type: 'UpdateAssessmentAnswersCommand',
            added: {
              SOME_QUESTION: { type: 'SingleValue', value: 'new answer' },
            },
            removed: [],
            assessmentUuid,
            user,
          },
          {
            type: 'UpdateFormVersionCommand',
            version: '2',
            assessmentUuid,
            user,
          },
        ],
        timeline: {
          type: 'TIMELINE_TYPE_GOES_HERE',
          data: {
            details: 'Sentence Plan version updated to v2',
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

      const goalsResult = await assessmentService.query<'Collection'>({
        type: 'CollectionQuery',
        collectionUuid: goalsCollectionUuid,
        depth: 0,
        assessmentUuid,
        user,
      })

      const goalsWithSteps = await assessmentService.query<'Collection'>({
        type: 'CollectionQuery',
        collectionUuid: goalsCollectionUuid,
        depth: 1,
        assessmentUuid,
        user,
      })

      const goalResult = await assessmentService.query<'CollectionItem'>({
        type: 'CollectionItemQuery',
        collectionItemUuid: goalUuid,
        depth: 0,
        assessmentUuid,
        user,
      })

      const goalWithSteps = await assessmentService.query<'CollectionItem'>({
        type: 'CollectionItemQuery',
        collectionItemUuid: goalUuid,
        depth: 1,
        assessmentUuid,
        user,
      })

      const stepsTimelineResult = await assessmentService.query<'AssessmentTimeline'>({
        type: 'AssessmentTimelineQuery',
        timelineTypes: ['STEP_ADDED'],
        assessmentUuid,
        user,
      })

      const goalsWithStepsPointInTime = await assessmentService.query<'Collection'>({
        type: 'CollectionQuery',
        collectionUuid: goalsCollectionUuid,
        depth: 1,
        timestamp: stepsTimelineResult.timeline[0].createdAt,
        assessmentUuid,
        user,
      })

      const goalWithStepsPointInTime = await assessmentService.query<'CollectionItem'>({
        type: 'CollectionItemQuery',
        collectionItemUuid: goalUuid,
        depth: 1,
        timestamp: stepsTimelineResult.timeline[0].createdAt,
        assessmentUuid,
        user,
      })

      const timelinePointInTime = await assessmentService.query<'AssessmentTimeline'>({
        type: 'AssessmentTimelineQuery',
        timestamp: timelineResult.timeline[1].createdAt,
        assessmentUuid,
        user,
      })

      return res.render('pages/sentence-plan', {
        assessmentUuid,
        sentencePlan,
        timelineResult,
        versions,
        goalsResult,
        goalsWithSteps,
        goalsWithStepsPointInTime,
        goalResult,
        goalWithSteps,
        goalWithStepsPointInTime,
        stepsTimelineResult,
        timelinePointInTime,
      })
    } catch (error) {
      return next(error)
    }
  })

  return router
}
