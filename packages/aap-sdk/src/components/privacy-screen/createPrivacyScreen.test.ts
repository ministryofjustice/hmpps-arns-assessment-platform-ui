import { Forge } from '@ministryofjustice/hmpps-forge/core'
import { createForgePackage, journey, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { govukComponents } from '@ministryofjustice/hmpps-forge/govuk-components'
import { createPrivacyScreen, PrivacyScreenConfig } from './createPrivacyScreen'

describe('createPrivacyScreen()', () => {
  let config: PrivacyScreenConfig

  beforeEach(() => {
    config = {
      loadEffects: [],
      submitEffects: [],
      submitRedirectPath: 'overview',
      alreadyAcceptedRedirectPath: 'overview',
      template: 'test/privacy',
      basePath: '/test',
      headerServiceNameLink: '/test/overview',
      personForename: 'Alex',
    }
  })

  it('should register with Forge when the optional feedback URL is omitted', () => {
    // Arrange
    const forge = new Forge({}).registerGlobalComponents(govukComponents)
    const privacyStep = createPrivacyScreen(config)
    const testPackage = createForgePackage({
      journey: journey({
        code: 'test',
        title: 'Test',
        path: '/test',
        steps: [privacyStep, step({ path: '/overview', title: 'Overview', blocks: [] })],
      }),
    })

    // Act
    const register = () => forge.registerPackage(testPackage)

    // Assert
    expect(register).not.toThrow()
    expect(privacyStep.view.locals).not.toHaveProperty('feedbackUrl')
  })

  it('should retain the feedback URL when one is supplied', () => {
    // Arrange
    config.feedbackUrl = 'https://example.com/feedback'

    // Act
    const privacyStep = createPrivacyScreen(config)

    // Assert
    expect(privacyStep.view.locals.feedbackUrl).toBe(config.feedbackUrl)
  })
})
