import type { Request, Response, NextFunction } from 'express'
import { autosaveMiddleware, transformFormDataToAnswers, prefetchAnswersMiddleware } from './autosaveMiddleware'

describe('autosaveMiddleware', () => {
  let mockAssessmentService: { command: jest.Mock; query: jest.Mock }
  let next: jest.Mock

  const buildMockRequest = (
    overrides: Partial<Request> & { headers?: Record<string, string> } = {},
  ): Partial<Request> => {
    const headers = overrides.headers || {}
    return {
      method: 'GET',
      path: '/test-step',
      params: {},
      body: {},
      get: ((header: string) => headers[header]) as Request['get'],
      ...overrides,
    }
  }

  const buildMockResponse = (localsOverrides: Record<string, unknown> = {}): Partial<Response> => {
    const res: Partial<Response> = {
      locals: {
        assessmentService: mockAssessmentService,
        user: {
          authSource: 'handover' as const,
          username: 'testuser',
          userId: 'user-123',
          name: 'Test User',
          displayName: 'Test User',
          userRoles: [],
          token: 'mock-token',
        },
        ...localsOverrides,
      },
      end: jest.fn(),
    }
    res.status = jest.fn().mockReturnValue(res)
    return res
  }

  beforeEach(() => {
    jest.resetAllMocks()

    mockAssessmentService = {
      command: jest.fn().mockResolvedValue({}),
      query: jest.fn().mockResolvedValue({ answers: {} }),
    }

    next = jest.fn()
  })

  describe('transformFormDataToAnswers', () => {
    it('transforms single string values to string arrays', () => {
      const body = { fieldName: 'value' }
      const result = transformFormDataToAnswers(body)
      expect(result).toEqual({ fieldName: ['value'] })
    })

    it('transforms array values (checkboxes) to string arrays', () => {
      const body = { checkboxField: ['option1', 'option2'] }
      const result = transformFormDataToAnswers(body)
      expect(result).toEqual({ checkboxField: ['option1', 'option2'] })
    })

    it('skips _csrf token', () => {
      const body = { _csrf: 'token123', fieldName: 'value' }
      const result = transformFormDataToAnswers(body)
      expect(result).toEqual({ fieldName: ['value'] })
    })

    it('skips action button field', () => {
      const body = { action: 'submit', fieldName: 'value' }
      const result = transformFormDataToAnswers(body)
      expect(result).toEqual({ fieldName: ['value'] })
    })

    it('skips empty string values', () => {
      const body = { emptyField: '', fieldName: 'value' }
      const result = transformFormDataToAnswers(body)
      expect(result).toEqual({ fieldName: ['value'] })
    })

    it('skips null and undefined values', () => {
      // @ts-expect-error testing null/undefined handling
      const body = { nullField: null, undefinedField: undefined, fieldName: 'value' }
      const result = transformFormDataToAnswers(body)
      expect(result).toEqual({ fieldName: ['value'] })
    })

    it('converts non-string values to strings', () => {
      const body = { numberField: 123, boolField: true }
      const result = transformFormDataToAnswers(body)
      expect(result).toEqual({ numberField: ['123'], boolField: ['true'] })
    })

    it('returns empty object for empty body', () => {
      const result = transformFormDataToAnswers({})
      expect(result).toEqual({})
    })
  })

  describe('middleware', () => {
    it('passes through non-POST requests', async () => {
      const middleware = autosaveMiddleware()
      const req = buildMockRequest({ method: 'GET' })
      const res = buildMockResponse()

      await middleware(req as Request, res as Response, next as NextFunction)

      expect(next).toHaveBeenCalled()
      expect(res.status).not.toHaveBeenCalled()
    })

    it('passes through POST requests without autosave header', async () => {
      const middleware = autosaveMiddleware()
      const req = buildMockRequest({ method: 'POST' })
      const res = buildMockResponse()

      await middleware(req as Request, res as Response, next as NextFunction)

      expect(next).toHaveBeenCalled()
      expect(res.status).not.toHaveBeenCalled()
    })

    it('handles autosave POST and calls assessmentService.command', async () => {
      const middleware = autosaveMiddleware()
      const req = buildMockRequest({
        method: 'POST',
        headers: { 'X-AAP-Autosave': 'true' },
        params: { assessmentId: 'uuid-123' },
        body: { fieldName: 'value' },
      })
      const res = buildMockResponse()

      await middleware(req as Request, res as Response, next as NextFunction)

      expect(mockAssessmentService.command).toHaveBeenCalledWith({
        type: 'UpdateAssessmentAnswersCommand',
        assessmentUuid: 'uuid-123',
        added: { fieldName: ['value'] },
        removed: [],
        autosave: true,
        user: { id: 'testuser', name: 'Test User' },
      })
      expect(next).not.toHaveBeenCalled()
    })

    it('returns 204 on success', async () => {
      const middleware = autosaveMiddleware()
      const req = buildMockRequest({
        method: 'POST',
        headers: { 'X-AAP-Autosave': 'true' },
        params: { assessmentId: 'uuid-123' },
        body: { fieldName: 'value' },
      })
      const res = buildMockResponse()

      await middleware(req as Request, res as Response, next as NextFunction)

      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.end).toHaveBeenCalled()
    })

    it('returns 500 on service error', async () => {
      mockAssessmentService.command.mockRejectedValueOnce(new Error('API error'))

      const middleware = autosaveMiddleware()
      const req = buildMockRequest({
        method: 'POST',
        headers: { 'X-AAP-Autosave': 'true' },
        params: { assessmentId: 'uuid-123' },
        body: { fieldName: 'value' },
      })
      const res = buildMockResponse()

      await middleware(req as Request, res as Response, next as NextFunction)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.end).toHaveBeenCalled()
    })

    it('falls through if assessmentId is missing', async () => {
      const middleware = autosaveMiddleware()
      const req = buildMockRequest({
        method: 'POST',
        headers: { 'X-AAP-Autosave': 'true' },
        params: {},
        body: { fieldName: 'value' },
      })
      const res = buildMockResponse()

      await middleware(req as Request, res as Response, next as NextFunction)

      expect(mockAssessmentService.command).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })

    it('falls through if assessmentService is not available', async () => {
      const middleware = autosaveMiddleware()
      const req = buildMockRequest({
        method: 'POST',
        headers: { 'X-AAP-Autosave': 'true' },
        params: { assessmentId: 'uuid-123' },
        body: { fieldName: 'value' },
      })
      const res = buildMockResponse({ assessmentService: undefined })

      await middleware(req as Request, res as Response, next as NextFunction)

      expect(next).toHaveBeenCalled()
    })

    it('uses default user values when user is not available', async () => {
      const middleware = autosaveMiddleware()
      const req = buildMockRequest({
        method: 'POST',
        headers: { 'X-AAP-Autosave': 'true' },
        params: { assessmentId: 'uuid-123' },
        body: { fieldName: 'value' },
      })
      const res = buildMockResponse({ user: undefined })

      await middleware(req as Request, res as Response, next as NextFunction)

      expect(mockAssessmentService.command).toHaveBeenCalledWith(
        expect.objectContaining({
          user: { id: 'unknown', name: 'Unknown User' },
        }),
      )
    })
  })

  describe('prefetchAnswersMiddleware', () => {
    it('passes through non-GET requests', async () => {
      const middleware = prefetchAnswersMiddleware()
      const req = buildMockRequest({ method: 'POST' })
      const res = buildMockResponse()

      await middleware(req as Request, res as Response, next as NextFunction)

      expect(next).toHaveBeenCalled()
      expect(mockAssessmentService.query).not.toHaveBeenCalled()
    })

    it('fetches answers via AssessmentVersionQuery for GET requests with assessmentId', async () => {
      mockAssessmentService.query.mockResolvedValueOnce({
        answers: { existingField: ['existingValue'] },
      })

      const middleware = prefetchAnswersMiddleware()
      const req = buildMockRequest({
        method: 'GET',
        params: { assessmentId: 'uuid-123' },
      })
      const res = buildMockResponse()

      await middleware(req as Request, res as Response, next as NextFunction)

      expect(mockAssessmentService.query).toHaveBeenCalledWith({
        type: 'AssessmentVersionQuery',
        assessmentUuid: 'uuid-123',
      })
      expect(res.locals.savedAnswers).toEqual({ existingField: ['existingValue'] })
      expect(next).toHaveBeenCalled()
    })

    it('sets empty savedAnswers if assessmentService is not available', async () => {
      const middleware = prefetchAnswersMiddleware()
      const req = buildMockRequest({
        method: 'GET',
        params: { assessmentId: 'uuid-123' },
      })
      const res = buildMockResponse({ assessmentService: undefined })

      await middleware(req as Request, res as Response, next as NextFunction)

      expect(res.locals.savedAnswers).toEqual({})
      expect(next).toHaveBeenCalled()
    })

    it('sets empty savedAnswers if assessmentId is missing', async () => {
      const middleware = prefetchAnswersMiddleware()
      const req = buildMockRequest({
        method: 'GET',
        params: {},
      })
      const res = buildMockResponse()

      await middleware(req as Request, res as Response, next as NextFunction)

      expect(mockAssessmentService.query).not.toHaveBeenCalled()
      expect(res.locals.savedAnswers).toEqual({})
      expect(next).toHaveBeenCalled()
    })

    it('sets empty savedAnswers on query error and continues', async () => {
      mockAssessmentService.query.mockRejectedValueOnce(new Error('API error'))

      const middleware = prefetchAnswersMiddleware()
      const req = buildMockRequest({
        method: 'GET',
        params: { assessmentId: 'uuid-123' },
      })
      const res = buildMockResponse()

      await middleware(req as Request, res as Response, next as NextFunction)

      expect(res.locals.savedAnswers).toEqual({})
      expect(next).toHaveBeenCalled()
    })

    it('handles null answers from query response', async () => {
      mockAssessmentService.query.mockResolvedValueOnce({ answers: null })

      const middleware = prefetchAnswersMiddleware()
      const req = buildMockRequest({
        method: 'GET',
        params: { assessmentId: 'uuid-321' },
      })
      const res = buildMockResponse()

      await middleware(req as Request, res as Response, next as NextFunction)

      expect(res.locals.savedAnswers).toEqual({})
      expect(next).toHaveBeenCalled()
    })
  })
})
