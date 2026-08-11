import { access, EffectRegistry, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { ForgeTestHarness } from '@ministryofjustice/hmpps-forge/core/testing'
import { govukComponents } from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsEffectImplementations } from '../../../../effects'
import { StrengthsAndNeedsGeneratorImplementations } from '../../../../generators'
import { strengthsAndNeedsTransformerImplementations } from '../../../../transformers'
import { strengthsAndNeedsConditionImplementations } from '../../../../conditions'
import { setViewAllAnswersBacklink } from '../../../../effects/session/setViewAllAnswersBacklink'
import { Section, SectionStatus } from '../../constants/section'
import { basePath } from '../../constants/formVersion'
import { viewAllAnswersStep } from './step'

/** Renders the real step with the given answers, seeded straight into the assessment. */
const renderPage = async (answers: Record<string, unknown> = {}, data: Record<string, unknown> = {}) => {
  const registry = new EffectRegistry()
  const seed = registry.register('Seed', () => async (context: any) => {
    context.setData('caseData', { name: { forename: 'Sam' } })
    Object.entries(answers).forEach(([code, value]) => context.setAnswer(code, value))
    Object.entries(data).forEach(([code, value]) => context.setData(code, value))
  })

  const client = new ForgeTestHarness()
    .registerGlobalComponents(govukComponents)
    .registerGlobalFunctions({
      ...StrengthsAndNeedsEffectImplementations,
      ...StrengthsAndNeedsGeneratorImplementations,
      ...strengthsAndNeedsTransformerImplementations,
      ...strengthsAndNeedsConditionImplementations,
    })
    .registerPackage({
      journey: journey({
        code: 'strengths-and-needs-v1',
        title: 'Strengths and needs',
        path: basePath,
        onAccess: [access({ effects: [seed()] })],
        steps: [viewAllAnswersStep],
      }),
      functions: registry,
    })
    .createClient()

  const result: any = await client.get(`${basePath}/view-all-answers`, {
    session: {},
    headers: { 'accept-language': 'en-gb' },
  })

  return result
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

const textsOf = (result: any, match: (block: any) => boolean) =>
  visible(result.context.blocks)
    .filter(match)
    .map(block => String(block.text ?? block.content))

const headings = (result: any, tag: string) => textsOf(result, b => b.variant === 'html' && b.tag === tag)
const rows = (result: any) => textsOf(result, b => b.variant === 'row')
const tags = (result: any) => textsOf(result, b => b.variant === 'govukTag')
const bodyText = (result: any) => textsOf(result, b => b.variant === 'html' && b.tag === 'p')

describe('view all answers', () => {
  it('can be reached whatever state the assessment is in', async () => {
    await expect(renderPage()).resolves.toMatchObject({ type: 'render' })
    await expect(renderPage({ alcohol_use: 'YES_WITHIN_LAST_THREE_MONTHS' })).resolves.toMatchObject({
      type: 'render',
    })
  })

  it('lists every section, including offence analysis, before any is started', async () => {
    expect(headings(await renderPage(), 'h2')).toEqual([
      'Accommodation',
      'Employment and education',
      'Finances',
      'Drug use',
      'Alcohol use',
      'Health and wellbeing',
      'Personal relationships and community',
      'Thinking, behaviours and attitudes',
      'Offence analysis',
    ])
  })

  /*
   * A section only reaches COMPLETE when its summary step is submitted, and that
   * submission validates the practitioner analysis answers too — so the one status
   * covers both the questions and the analysis.
   */
  it('shows a status against every section, complete only once the section is', async () => {
    expect(tags(await renderPage())).toEqual(Array(9).fill('Incomplete'))

    const complete = await renderPage({}, { [Section.alcohol_use.statusKey]: SectionStatus.complete })
    expect(tags(complete).filter(tag => tag === 'Complete')).toHaveLength(1)
  })

  it('shows only the questions that have been answered', async () => {
    const result = await renderPage({ alcohol_use: 'YES_WITHIN_LAST_THREE_MONTHS' })

    expect(rows(result)).toEqual(['Has Sam ever drunk alcohol?'])
  })

  it('shows answers with notes', async () => {
    const result = await renderPage({
      alcohol_use_practitioner_analysis_risk_of_serious_harm: 'YES',
      alcohol_use_practitioner_analysis_risk_of_serious_harm_yes_details: 'Escalates when drinking.',
    })

    expect(bodyText(result)).toEqual(expect.arrayContaining(['Yes', 'Escalates when drinking.']))
  })

  it('reads as answer-then-detail however deeply the answers are nested', async () => {
    const result = await renderPage({
      suitable_housing_planned: 'YES',
      future_accommodation_type: ['AWAITING_PLACEMENT', 'OTHER'],
      future_accommodation_type_awaiting_placement_details: 'On the waiting list.',
      future_accommodation_type_other_details: 'Staying with a cousin.',
    })

    expect(bodyText(result)).toEqual([
      'Yes',
      'Awaiting placement',
      'On the waiting list.',
      'Other',
      'Staying with a cousin.',
    ])
  })

  /*
   * How often a drug is used is asked once per drug on a later step, so it has
   * nowhere to sit here except under the drug it belongs to.
   */
  it('shows each drug with how often it is used and any details given', async () => {
    const result = await renderPage({
      drug_use: 'YES',
      select_misused_drugs: ['CANNABIS', 'HEROIN'],
      drug_last_used_cannabis: 'LAST_SIX',
      how_often_used_cannabis: 'DAILY',
      how_often_used_cannabis_details: 'Most evenings.',
      drug_last_used_heroin: 'MORE_THAN_SIX',
    })

    // Each answer is paired with its own name, so a screen reader reads them together.
    expect(rows(result)).toEqual([
      'Has Sam ever misused drugs?',
      'Which drugs has Sam misused?',
      'Last used',
      'How often',
      'Details',
      'Last used',
    ])
    expect(bodyText(result)).toEqual([
      'Yes',
      'Cannabis',
      'Used in the last 6 months',
      'Daily',
      'Most evenings.',
      'Heroin',
      'Used more than 6 months ago',
    ])
  })

  it('shows a date as it reads rather than as it is stored', async () => {
    const result = await renderPage({
      current_accommodation: 'TEMPORARY',
      type_of_temporary_accommodation: 'CAS3',
      cas3_end_date: '2027-01-15',
    })

    expect(bodyText(result)).toEqual(['Temporary', 'Community Accommodation Service Tier 3 (CAS3)', '15 January 2027'])
  })

  it('sets practitioner analysis under its own heading', async () => {
    const result = await renderPage({
      alcohol_use: 'YES_WITHIN_LAST_THREE_MONTHS',
      alcohol_use_practitioner_analysis_risk_of_serious_harm: 'YES',
    })

    expect(headings(result, 'h3')).toEqual(['Summary', 'Practitioner analysis'])
  })

  describe('back link tests', () => {
    const backlinkFor = async (previousPageUrl?: string) => {
      const context = {
        data: {} as Record<string, unknown>,
        getState: () => previousPageUrl,
        setData(key: string, value: unknown) {
          this.data[key] = value
        },
      }

      await setViewAllAnswersBacklink()(context as never, basePath, Section.accommodation.sideNavHref)
      return context.data.viewAllAnswersBacklink
    }

    it('returns to the page the user opened this one from', async () => {
      await expect(backlinkFor(`${basePath}/alcohol-use/alcohol-use?resume=true`)).resolves.toBe(
        `${basePath}/alcohol-use/alcohol-use?resume=true`,
      )
    })

    it('falls back to the start of the assessment for anything else', async () => {
      await expect(backlinkFor()).resolves.toBe(Section.accommodation.sideNavHref)
      await expect(backlinkFor('/some/other/path')).resolves.toBe(Section.accommodation.sideNavHref)
    })
  })
})
