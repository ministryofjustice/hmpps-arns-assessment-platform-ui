import nunjucks from 'nunjucks'
import { StructureType } from '@ministryofjustice/hmpps-forge/core/authoring'
import { EvaluatedBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { formatDate } from '../../../../utils/utils'
import { previousVersions, PreviousVersions } from './previousVersions'
import { PreviousVersionsResponse, VersionDetails } from '../../../../interfaces/coordinator-api/previousVersions'

const nunjucksEnv = nunjucks.configure(
  [
    'server/views',
    'server/forms',
    'packages/form-engine-moj-components/src/',
    'node_modules/govuk-frontend/dist/',
    'node_modules/@ministryofjustice/frontend/',
  ],
  { autoescape: true },
)

nunjucksEnv.addFilter('formatSimpleDate', date => formatDate(date, 'simple'))

describe('previous versions', () => {
  const baseBlock = {
    type: StructureType.BLOCK,
    personName: 'Test',
  }

  it('renders no previous versions', async () => {
    const html = await previousVersions.render(
      {
        ...baseBlock,
        variant: 'previousVersions',
      } as EvaluatedBlock<PreviousVersions>,
      nunjucksEnv,
    )

    expect(html).toContain("There are no previous versions of Test's assessment and plan yet.")
  })

  it('renders multiple unsigned previous versions', async () => {
    const today = new Date()
    const yesterday = new Date()
    const twoDaysAgo = new Date()

    yesterday.setDate(today.getDate() - 1)
    twoDaysAgo.setDate(today.getDate() - 2)

    const toDateKey = (d: Date) => d.toISOString().split('T')[0]

    const unsignedBlock = {
      type: StructureType.BLOCK,
      personName: 'Test',
      previousVersions: {
        allVersions: {
          [toDateKey(yesterday)]: {
            description: 'Assessment and plan updated',
            assessmentVersion: {
              uuid: crypto.randomUUID(),
              version: yesterday.getTime(),
              createdAt: yesterday.toISOString(),
              updatedAt: yesterday.toISOString(),
              status: 'UNSIGNED',
              planAgreementStatus: '',
              entityType: 'ASSESSMENT',
            } as VersionDetails,
            planVersion: {
              uuid: crypto.randomUUID(),
              version: yesterday.getTime(),
              createdAt: yesterday.toISOString(),
              updatedAt: yesterday.toISOString(),
              status: 'UNSIGNED',
              planAgreementStatus: 'AGREED',
              entityType: 'AAP_PLAN',
            } as VersionDetails,
          },
          [toDateKey(twoDaysAgo)]: {
            description: 'Plan updated',
            assessmentVersion: null,
            planVersion: {
              uuid: crypto.randomUUID(),
              version: twoDaysAgo.getTime(),
              createdAt: twoDaysAgo.toISOString(),
              updatedAt: twoDaysAgo.toISOString(),
              status: 'UNSIGNED',
              planAgreementStatus: 'AGREED',
              entityType: 'AAP_PLAN',
            } as VersionDetails,
          },
        },
        countersignedVersions: {},
      } as PreviousVersionsResponse,
    }

    const html = await previousVersions.render(
      {
        ...unsignedBlock,
        variant: 'previousVersions',
      } as EvaluatedBlock<PreviousVersions>,
      nunjucksEnv,
    )

    // Previous versions table
    const table = html.match(/<table[^>]*data-qa="previous-versions-table"[^>]*>/)
    expect(table).toHaveLength(1)

    // Table populated with non-countersigned data
    expect(html).toContain("Check versions of Test's current assessment and plan. The links will open in a new tab.")
    expect(html).toContain('Assessment and plan updated')
    expect(html).toContain('Plan updated')
    expect(html).toContain('Plan agreed')
    expect(html).not.toContain('govuk-table__caption--m')

    // Row details
    const rows = html.match(/<tr/g)
    expect(rows).toHaveLength(3)
    expect(html).toContain('Date and what was updated')
    expect(html).toContain('Assessment')
    expect(html).toContain('Sentence plan')
    expect(html).toContain('Status')

    const assesmentLink = html.match(/<a[^>]*data-qa="assessment-link"[^>]*>/)?.[0]
    expect(assesmentLink).toContain('target="_blank"')
    const planLink = html.match(/<a[^>]*data-qa="assessment-link"[^>]*>/)?.[0]
    expect(planLink).toContain('target="_blank"')

    const yesterdayRegex = new RegExp(
      `${yesterday.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`,
    )
    const yesterdayFormat = html.match(yesterdayRegex)
    expect(yesterdayFormat).toHaveLength(1)
    const twoDaysAgoRegex = new RegExp(
      `${yesterday.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`,
    )
    const twoDaysAgoFormat = html.match(twoDaysAgoRegex)
    expect(twoDaysAgoFormat).toHaveLength(1)
  })
})
