import { asSystem } from '@ministryofjustice/hmpps-rest-client'
import { expect } from '@playwright/test'
import { QueriesResponse } from '@server/interfaces/aap-api/response'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { victimsCollection } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/offence-analysis/constants/collections'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/offence-analysis/constants/option'
import { Step } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/offence-analysis/constants/step'
import OffenceAnalysisPage from 'pages/strengthsAndNeeds/offenceAnalysisPage'
import { test, TargetService } from '../../../support/fixtures'
import { offence, sanFormPath, v1Path } from '../sanUtils'

test.describe('Missing victim collection', () => {
  for (const resume of [false, true]) {
    test(`saves Other-only answers from ${resume ? 'resume' : 'direct'} entry`, async ({
      page,
      createSession,
      strengthsAndNeedsBuilder,
      aapClient,
      baseURL,
    }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder.extend(sanAssessmentId).save()

      await OffenceAnalysisPage.navigateTo(
        page,
        handoverLink,
        baseURL,
        sanAssessmentId,
        `${Step.offence_analysis.path}${resume ? '?resume=true' : ''}`,
      )
      const offenceAnalysisPage = await OffenceAnalysisPage.verifyOnPage(page, 'Enter a brief description of')
      const { questions } = offenceAnalysisPage

      await questions.offence_analysis_description_of_offence.input.fill('Damage to a shop window.')
      await questions.offence_analysis_elements.option(Option.physical_damage_to_property).check()
      await questions.offence_analysis_reason.input.fill('An argument with the business owner escalated.')
      await questions.offence_analysis_motivations.option(Option.emotional_state).check()
      await questions.offence_analysis_who_was_the_victim.option(CommonOption.other).check()
      await questions.offence_analysis_who_was_the_victim_other_details.input.fill('A local business.')
      await expect(questions.offence_analysis_who_was_the_victim.option(Option.one_or_more_person)).not.toBeChecked()

      const response: QueriesResponse = await aapClient.post(
        {
          path: '/query',
          data: {
            queries: [
              {
                type: 'AssessmentVersionQuery',
                assessmentIdentifier: { type: 'UUID', uuid: sanAssessmentId },
                user: { id: 'e2e-test', name: 'E2E Test', authSource: 'HMPPS_AUTH' },
              },
            ],
          },
        },
        asSystem(),
      )
      const assessment = response.queries[0].result
      expect(assessment.type).toBe('AssessmentVersionQueryResult')
      if (assessment.type !== 'AssessmentVersionQueryResult') {
        throw new Error(`Expected assessment version, received ${assessment.type}`)
      }
      expect(assessment.collections.map(collection => collection.name)).not.toContain(victimsCollection.name)

      await offenceAnalysisPage.saveAndContinue.click()

      await expect(page).toHaveURL(
        `${baseURL}${sanFormPath}${v1Path}/edit/${sanAssessmentId}/current${offence}/${Step.offence_analysis_involved_parties.path}`,
      )
      await expect(
        page.getByRole('group', {
          name: 'How many other people were involved with committing the current index offence(s)?',
          exact: true,
        }),
      ).toBeVisible()
    })
  }
})
