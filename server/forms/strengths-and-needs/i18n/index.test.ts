import {
  createForgePackage,
  ChainableExpr,
  Data,
  Format,
  journey,
  step,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { ForgeTestHarness, FunctionRegistryTestHarness } from '@ministryofjustice/hmpps-forge/core/testing'
import { contentFrom } from './index'
import { sanTransformers, StrengthsAndNeedsTransformers } from '../transformers'

const english = {
  greeting: 'Hello %1, %2',
  repeated: '%1 / %1 / %2',
  nested: { text: 'Nested translation', replacement: 'Replacement %1' },
  englishOnly: 'English only',
  empty: '',
  invalid: 42,
  html: '<strong>%1</strong>',
  unrelated: 'This content must not be embedded in every expression',
}
const locales = {
  'en-gb': english,
  cy: { greeting: 'Helo %1, %2', empty: '' },
}
const contentFor = contentFrom<typeof english>(locales)

const definitionFor = (expression: ChainableExpr) =>
  step({
    path: '/example',
    title: 'Translation',
    reachability: { entryWhen: true },
    blocks: [HtmlBlock({ tag: 'p', content: expression })],
  })

const render = async (expression: ChainableExpr, language: string = 'en-gb', data: Record<string, unknown> = {}) => {
  const client = new ForgeTestHarness()
    .registerGlobalFunctions(sanTransformers)
    .registerPackage(
      createForgePackage({
        journey: journey({
          code: 'translations',
          title: 'Translations',
          path: '/translations',
          data,
          steps: [definitionFor(expression)],
        }),
      }),
    )
    .createClient()

  const result = await client.get('/translations/example', {
    session: {},
    headers: { 'accept-language': language },
  })
  if (result.type !== 'render') {
    throw new Error(`Expected a render, received ${JSON.stringify(result)}`)
  }
  return result.context.blocks[0].properties.content
}

describe('contentFrom', () => {
  it('embeds only the requested per-language strings for static paths', () => {
    const definition = JSON.stringify(definitionFor(contentFor('greeting')))

    expect(definition).toContain('ContentValue')
    expect(definition).toContain('Hello %1, %2')
    expect(definition).toContain('Helo %1, %2')
    expect(definition).not.toContain('ContentFor')
    expect(definition).not.toContain(english.unrelated)
    expect(definition).not.toContain(english.nested.text)
  })

  it('does not mutate the source dictionaries', () => {
    const before = JSON.stringify(locales)
    contentFor('nested.text')
    expect(JSON.stringify(locales)).toBe(before)
  })

  it.each([
    ['en-gb', 'Hello Sam, welcome'],
    ['EN-GB,en;q=0.9', 'Hello Sam, welcome'],
    ['cy,en-gb;q=0.9', 'Helo Sam, welcome'],
    ['fr', 'Hello Sam, welcome'],
    ['cy;q=0.9,en-gb', 'Hello Sam, welcome'],
    ['', 'Hello Sam, welcome'],
  ])('preserves language selection for %j', async (language, expected) => {
    expect(await render(contentFor('greeting', 'Sam', 'welcome'), language)).toBe(expected)
  })

  it('resolves nested paths without carrying sibling content', async () => {
    const expression = contentFor('nested.text')
    expect(await render(expression)).toBe('Nested translation')
    expect(JSON.stringify(definitionFor(expression))).not.toContain(english.nested.replacement)
  })

  it('does not fall back to English when a supported locale lacks a key', async () => {
    expect(await render(contentFor('englishOnly'), 'cy')).toBe('NO_TRANSLATION')
  })

  it('preserves empty strings and rejects non-string content', async () => {
    expect(await render(contentFor('empty'), 'cy')).toBe('')
    expect(await render(contentFor('invalid'))).toBe('NO_TRANSLATION')
  })

  it('returns NO_TRANSLATION when a static key is missing from every locale', async () => {
    const missingContentFor = contentFrom<{ missing: string }>(locales)
    expect(await render(missingContentFor('missing'))).toBe('NO_TRANSLATION')
  })

  it('keeps replacement expressions request-dependent', async () => {
    const expression = contentFor('greeting', Data('name'), Data('message'))
    expect(await render(expression, 'en-gb', { name: 'Sam', message: 'welcome' })).toBe('Hello Sam, welcome')
    expect(await render(expression, 'cy', { name: 'Alex', message: 'croeso' })).toBe('Helo Alex, croeso')
  })

  it('supports nested translated replacements', async () => {
    expect(
      await render(contentFor('greeting', contentFor('nested.replacement', Data('name')), 'welcome'), 'en-gb', {
        name: 'Sam',
      }),
    ).toBe('Hello Replacement Sam, welcome')
  })

  it('preserves replacement order and replaces only the first matching placeholder', async () => {
    expect(await render(contentFor('repeated', '%2', 'done'))).toBe('done / %1 / %2')
  })

  it('preserves replacement-string dollar semantics', async () => {
    expect(await render(contentFor('greeting', '$&', '$$'))).toBe('Hello %1, $')
  })

  it('preserves HTML and replacement content for the existing rendering/escaping layer', async () => {
    expect(await render(contentFor('html', '<script>example</script>'))).toBe(
      '<strong><script>example</script></strong>',
    )
  })

  it('retains the existing lookup for runtime expression paths', async () => {
    const expression = contentFor(Format('nested.%1', Data('key')), Data('name'))
    expect(JSON.stringify(definitionFor(expression))).toContain('ContentFor')
    expect(await render(expression, 'en-gb', { key: 'replacement', name: 'Sam' })).toBe('Replacement Sam')
    expect(await render(expression, 'en-gb', { key: 'text', name: 'Sam' })).toBe('Nested translation')
    expect(await render(expression, 'en-gb', { key: 'missing' })).toBe('NO_TRANSLATION')
  })
})

describe('ContentValue', () => {
  const harness = new FunctionRegistryTestHarness(sanTransformers)

  it.each([null, '', 'en-gb', 'EN-GB', 'fr'])('preserves the default language for %j', language => {
    expect(
      harness.evaluate(StrengthsAndNeedsTransformers.ContentValue({ 'en-gb': 'English' })).withInput(language),
    ).toBe('English')
  })

  it('preserves pipeline short-circuiting for an absent language header', () => {
    expect(
      harness.evaluate(StrengthsAndNeedsTransformers.ContentValue({ 'en-gb': 'English' })).withInput(undefined),
    ).toBeUndefined()
    expect(
      harness.evaluate(StrengthsAndNeedsTransformers.ContentFor(locales, 'englishOnly')).withInput(undefined),
    ).toBeUndefined()
  })

  it('distinguishes a missing translation from an unsupported language', () => {
    const expression = StrengthsAndNeedsTransformers.ContentValue({ 'en-gb': 'English', cy: null })
    expect(harness.evaluate(expression).withInput('cy')).toBe('NO_TRANSLATION')
    expect(harness.evaluate(expression).withInput('fr')).toBe('English')
  })
})
