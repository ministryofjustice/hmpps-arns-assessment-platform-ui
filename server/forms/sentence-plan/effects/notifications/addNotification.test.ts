import { PlanNotification, SentencePlanContext } from '../types'
import { addNotification } from './addNotification'

describe('addNotification', () => {
  let session: { notifications?: PlanNotification[] }
  let context: SentencePlanContext

  const notification: PlanNotification = {
    type: 'success',
    message: 'You changed a goal',
    target: 'plan-overview',
  }

  beforeEach(() => {
    session = {}
    context = { getSession: jest.fn(() => session) } as unknown as SentencePlanContext
  })

  describe('addNotification()', () => {
    it('should add the notification with the message promoted to the title', async () => {
      // Arrange / Act
      await addNotification()(context, notification)

      // Assert
      expect(session.notifications).toEqual([
        { type: 'success', title: 'You changed a goal', message: undefined, target: 'plan-overview' },
      ])
    })

    it('should add the notification when onlyWhen is true', async () => {
      // Arrange / Act
      await addNotification()(context, { ...notification, onlyWhen: true })

      // Assert
      expect(session.notifications).toHaveLength(1)
    })

    it('should not add the notification when onlyWhen is false', async () => {
      // Arrange / Act
      await addNotification()(context, { ...notification, onlyWhen: false })

      // Assert
      expect(session.notifications).toBeUndefined()
    })
  })
})
