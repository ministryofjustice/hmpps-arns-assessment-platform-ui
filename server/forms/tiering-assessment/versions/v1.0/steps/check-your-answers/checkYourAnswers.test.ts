import { access, EffectRegistry, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { ForgeTestHarness, TestRenderResult } from '@ministryofjustice/hmpps-forge/core/testing'
import { GovUKBody, govukComponents, GovUKHeading } from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { checkYourAnswersStep } from './step'
import { CaseDetails } from '../../../../../../interfaces/delius-api/caseDetails'
import { TieringAssessmentEffectsDeps } from '../../../../@types/TieringAssessmentEffectsDeps'
import { TieringAssessmentEffectContext } from '../../../../@types/TieringAssessmentEffectContext'
import { sanGenerators } from '../../../../generators'
import { sanTransformers } from '../../../../transformers/transformers'
import { sanConditions } from '../../../../conditions/conditions'
import { basePath } from '../../constants/formVersion'
import { TieringAssessmentEffectsRegistry } from '../../../../effects/TieringAssessmentEffects'

/** Renders the real step with the given answers, seeded straight into the assessment. */
const renderPage = async (
  answers: Record<string, unknown> = {},
  data: Record<string, unknown> = {},
): Promise<TestRenderResult> => {
  const testEffects = new EffectRegistry<TieringAssessmentEffectsDeps>()
  const seed = testEffects.register('Seed', () => async (context: TieringAssessmentEffectContext) => {
    context.setData('caseData', { name: { forename: 'Sam' } } as unknown as CaseDetails)
    Object.entries(answers).forEach(([code, value]) => context.setAnswer(code, value))
    Object.entries(data).forEach(([code, value]) => context.setData(code, value))
  })

  const client = new ForgeTestHarness()
    .registerGlobalComponents(govukComponents)
    .registerGlobalFunctions([
      testEffects,
      TieringAssessmentEffectsRegistry,
      sanGenerators,
      sanTransformers,
      sanConditions,
    ])
    .registerPackage({
      journey: journey({
        code: 'tiering-assessment-v1',
        title: 'Tiering Assessment',
        path: basePath,
        onAccess: [access({ effects: [seed()] })],
        steps: [checkYourAnswersStep],
      }),
      forgePackage: true,
    })
    .createClient()

  return (await client.get(`${basePath}/check-your-answers`, {
    session: {},
    headers: { 'accept-language': 'en-gb' },
  })) as TestRenderResult
}

/** Everything on screen, with anything hidden by `visibleWhen` left out. */
const visible = (node: any, found: any[] = []): any[] => {
  if (Array.isArray(node)) {
    node.forEach(child => visible(child, found))
    return found
  }
  if (node === null || typeof node !== 'object') return found
  if (node.visibleWhen === false || node.properties?.visibleWhen === false) return found

  if (node.variant) found.push({ variant: node.variant, ...node.properties })
  if (node.key) found.push({ variant: 'row', text: node.key.text ?? node.key.html })

  Object.values(node.properties ?? node).forEach(child => visible(child, found))
  return found
}

const findBlocksOfType = (result: TestRenderResult, match: (block: any) => boolean) =>
  visible(result.context.blocks)
    .filter(match)

const extractText = (block: any) => String(block.text ?? block.content)

const isGovUKHeading = (block: HtmlBlock): block is HtmlBlock & GovUKHeading => block.variant === 'govukHeading'

const isGovUKBody = (block: HtmlBlock): block is HtmlBlock & GovUKBody => block.variant === 'govukBody'

const isRow = (block: HtmlBlock): block is HtmlBlock => block.variant === 'row'

const headings = (result: TestRenderResult, level: number) =>
  findBlocksOfType(result, isGovUKHeading)
    .filter(block => block.level === level)
    .map(extractText)

const rows = (result: TestRenderResult) =>
  findBlocksOfType(result, isRow)
    .map(extractText)

const bodyText = (result: TestRenderResult) =>
  findBlocksOfType(result, isGovUKBody)
    .map(extractText)

describe('check your answers', () => {
  it('can be reached whatever state the assessment is in', async () => {
    await expect(renderPage()).resolves.toMatchObject({ type: 'render' })
    await expect(renderPage({ suitability_of_accommodation: 'SOME_PROBLEMS' })).resolves.toMatchObject({
      type: 'render',
    })
  })

  it('lists every section, before any is started', async () => {
    expect(headings(await renderPage(), 2)).toEqual(['Accommodation'])
  })

  /*
   * A section only reaches COMPLETE when its summary step is submitted, and that
   * submission validates the practitioner analysis answers too — so the one status
   * covers both the questions and the analysis.
   */

  it('shows only the questions that have been answered', async () => {
    const result = await renderPage({ suitability_of_accommodation: 'SOME_PROBLEMS' })

    expect(rows(result)).toEqual(["Is Sam's accommodation suitable?"])
  })

  /*
   * How often a drug is used is asked once per drug on a later step, so it has
   * nowhere to sit here except under the drug it belongs to.
   */
  it('shows each drug with how often it is used and any details given', async () => {
    const result = await renderPage({
      suitability_of_accommodation: 'SOME_PROBLEMS',
      who_are_they_living_with: 'FRIENDS',
    })

    // Each answer is paired with its own name, so a screen reader reads them together.
    expect(rows(result)).toEqual(['Who is Sam living with?', "Is Sam's accommodation suitable?"])
    expect(bodyText(result)).toEqual(['Friends', 'Yes, with concerns'])
  })
})
