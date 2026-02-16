import { TargetService, test } from '../../../support/fixtures'

test.describe('Migration', () => {
  test.describe('Migrate', () => {
    test('Migrates from v3 to v4', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      // Navigate to migration
      page.goto('/sentence-plan/migration')
    })
  })
})
