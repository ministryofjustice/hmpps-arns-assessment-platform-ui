import { getSessionTimeoutContent } from './sessionTimeoutContent'

describe('sessionTimeoutContent', () => {
  describe('getSessionTimeoutContent()', () => {
    it('should return Sentence Plan content when the service is sentence-plan', () => {
      // Act
      const content = getSessionTimeoutContent('sentence-plan')

      // Assert
      expect(content.modal.heading).toBe('Your unsaved information will be deleted soon')
      expect(content.page.returnButton).toEqual({ text: 'Go to the plan', href: '/sentence-plan/v1.0/plan/overview' })
    })

    it('should return Strengths and needs content when the service is strengths-and-needs', () => {
      // Act
      const content = getSessionTimeoutContent('strengths-and-needs')

      // Assert
      expect(content.modal.description).toContain('Your information has been saved.')
      expect(content.page.returnButton).toEqual({ text: 'Go to strengths and needs', href: '/strengths-and-needs' })
    })

    it.each([undefined, '', 'unknown-service', 'constructor', ['sentence-plan']])(
      'should return default content without a return button when the service is %p',
      service => {
        // Act
        const content = getSessionTimeoutContent(service)

        // Assert
        expect(content.page.heading).toBe('Your session has ended')
        expect(content.page.returnButton).toBeUndefined()
      },
    )

    it.each(['sentence-plan', 'strengths-and-needs', undefined])(
      'should include the countdown placeholder in the modal description when the service is %p',
      service => {
        // Act
        const content = getSessionTimeoutContent(service)

        // Assert
        expect(content.modal.description).toContain('{countdown}')
      },
    )
  })
})
