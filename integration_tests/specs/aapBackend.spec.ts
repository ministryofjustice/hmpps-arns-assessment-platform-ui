import { test, expect } from '../support/fixtures'
import { AssessmentBuilder } from '../builders/AssessmentBuilder'

test.describe('AAP Backend', () => {
  test('can create an assessment via the AAP API', async ({ aapClient }) => {
    // Arrange
    const builder = new AssessmentBuilder()
      .ofType('E2E_TEST')
      .withFormVersion('1')
      .withAnswer('test_field', 'test value')

    // Act
    const assessment = await builder.create(aapClient)

    // Assert
    expect(assessment.uuid).toBeDefined()
    expect(assessment.uuid).toMatch(/^[0-9a-f-]{36}$/)
  })

  test('can create an assessment with collections', async ({ aapClient }) => {
    // Arrange
    const builder = new AssessmentBuilder()
      .ofType('E2E_TEST')
      .withCollection('items', collection =>
        collection.withItem(item => item.withAnswer('description', 'Test item')),
      )

    // Act
    const assessment = await builder.create(aapClient)

    // Assert
    expect(assessment.uuid).toBeDefined()
    expect(assessment.collections).toHaveLength(1)
    expect(assessment.collections[0].name).toBe('items')
    expect(assessment.collections[0].items).toHaveLength(1)
    expect(assessment.collections[0].items[0].uuid).toBeDefined()
  })

  test('can create an assessment with custom CRN', async ({ aapClient }) => {
    // Arrange
    const customCrn = 'X123456'
    const builder = new AssessmentBuilder().ofType('E2E_TEST').forCrn(customCrn)

    // Act
    const assessment = await builder.create(aapClient)

    // Assert
    expect(assessment.uuid).toBeDefined()
  })
})
