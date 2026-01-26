import { test, expect } from '../support/fixtures'
import type { CollectionBuilder, CollectionItemBuilder } from '../builders/AssessmentBuilder'

test.describe('AAP Backend', () => {
  test('can create an assessment via the AAP API', async ({ assessmentBuilder }) => {
    // Arrange
    const builder = assessmentBuilder
      .fresh()
      .ofType('E2E_TEST')
      .withFormVersion('1')
      .withAnswer('test_field', 'test value')

    // Act
    const assessment = await builder.save()

    // Assert
    expect(assessment.uuid).toBeDefined()
    expect(assessment.uuid).toMatch(/^[0-9a-f-]{36}$/)
  })

  test('can create an assessment with collections', async ({ assessmentBuilder }) => {
    // Arrange
    const builder = assessmentBuilder
      .fresh()
      .ofType('E2E_TEST')
      .withCollection('items', (collection: CollectionBuilder) =>
        collection.withItem((item: CollectionItemBuilder) => item.withAnswer('description', 'Test item')),
      )

    // Act
    const assessment = await builder.save()

    // Assert
    expect(assessment.uuid).toBeDefined()
    expect(assessment.collections).toHaveLength(1)
    expect(assessment.collections[0].name).toBe('items')
    expect(assessment.collections[0].items).toHaveLength(1)
    expect(assessment.collections[0].items[0].uuid).toBeDefined()
  })

  test('can create an assessment with custom CRN', async ({ assessmentBuilder }) => {
    // Arrange
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
    const digits = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0')
    const customCrn = `${letter}${digits}`

    const builder = assessmentBuilder.fresh().ofType('E2E_TEST').forCrn(customCrn)

    // Act
    const assessment = await builder.save()

    // Assert
    expect(assessment.uuid).toBeDefined()
  })
})
