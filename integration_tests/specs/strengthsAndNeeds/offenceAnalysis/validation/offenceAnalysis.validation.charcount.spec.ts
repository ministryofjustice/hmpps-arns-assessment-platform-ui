import { Step } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/offence-analysis/constants/step'
import { CharacterLimit } from '@server/forms/strengths-and-needs/constants/characterLimit'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/offence-analysis/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/offence-analysis/constants/question'
import OffenceAnalysisPage from 'pages/strengthsAndNeeds/offenceAnalysisPage'
import { expectTheLimitsOnThePage } from '../../characterCounts'
import { test } from '../../fixtures'
import { offence } from '../../sanUtils'

/**
 * Some offence analysis fields have character limits. These tests exercise the page to reveal the character count
 * fields, then check each one holds to its limit: one character over fails validation, exactly the limit passes.
 *
 * The weapon is a plain text input with no character count, so it is named rather than discovered.
 */

const answers = [
  { question: Question.offence_analysis_description_of_offence, value: 'Some details' },
  { question: Question.offence_analysis_elements, value: [Option.arson, Option.weapon] },
  { question: Question.offence_weapon_details, value: 'A knife' },
  { question: Question.offence_analysis_reason, value: 'Some details' },
  { question: Question.offence_analysis_motivations, value: [Option.emotional_state] },
  { question: Question.offence_analysis_who_was_the_victim, value: [CommonOption.other] },
  { question: Question.offence_analysis_who_was_the_victim_other_details, value: 'Some details' },
  { question: Question.offence_analysis_how_many_involved, value: Option.two },
  { question: Question.offence_analysis_leader, value: CommonOption.yes },
  { question: Question.offence_analysis_leader_yes_details, value: 'Some details' },
  { question: Question.offence_analysis_impact_on_victims, value: CommonOption.yes },
  { question: Question.offence_analysis_impact_on_victims_yes_details, value: 'Some details' },
  { question: Question.offence_analysis_accept_responsibility, value: CommonOption.yes },
  { question: Question.offence_analysis_accept_responsibility_yes_details, value: 'Some details' },
  { question: Question.offence_analysis_escalation, value: CommonOption.yes },
  { question: Question.offence_analysis_escalation_yes_details, value: 'Some details' },
  { question: Question.offence_analysis_perpetrator_of_domestic_abuse, value: CommonOption.no },
  { question: Question.offence_analysis_victim_of_domestic_abuse, value: CommonOption.no },
  { question: Question.offence_analysis_patterns_of_offending, value: 'Some details' },
  { question: Question.offence_analysis_risk, value: CommonOption.yes },
  { question: Question.offence_analysis_risk_yes_details, value: 'Some details' },
]

test.describe('Offence analysis character counts', () => {
  // the description of the offence and why it happened are always shown on this page
  test('offence-analysis: elements of the offence, motivations and who the victim was', async ({
    page,
    openSection,
  }) => {
    const section = await openSection(offence, answers)
    const offenceAnalysisPage = new OffenceAnalysisPage(page)
    const { questions } = offenceAnalysisPage
    await page.goto(`${section}/${Step.offence_analysis.path}`)

    await questions.offence_analysis_elements.option(Option.victim_targeted).check()
    await questions.offence_analysis_motivations.option(CommonOption.other).check()
    await questions.offence_analysis_who_was_the_victim.option(CommonOption.other).check()

    await expectTheLimitsOnThePage(offenceAnalysisPage)
  })

  test('offence-analysis: the weapon used', async ({ page, openSection }) => {
    const section = await openSection(offence, answers)
    const offenceAnalysisPage = new OffenceAnalysisPage(page)
    const { questions } = offenceAnalysisPage
    await page.goto(`${section}/${Step.offence_analysis.path}`)

    await questions.offence_analysis_elements.option(Option.weapon).check()

    await expectTheLimitsOnThePage(offenceAnalysisPage, {
      plainInputs: [
        {
          code: Question.offence_weapon_details,
          limit: CharacterLimit.c200,
          message: `Weapon must be ${CharacterLimit.c200} characters or less`,
        },
      ],
    })
  })

  test('offence-analysis-victim/create: how they know the victim', async ({ page, openSection }) => {
    const section = await openSection(offence, answers)
    const offenceAnalysisPage = new OffenceAnalysisPage(page)
    const { questions } = offenceAnalysisPage
    await page.goto(`${section}/${Step.offence_analysis_victim.path}`)

    await questions.offence_analysis_victim_relationship.option(CommonOption.other).check()

    await expectTheLimitsOnThePage(offenceAnalysisPage)
  })

  // a test per option, because each one reveals its own details field
  for (const { answer, abuse } of [
    { answer: CommonOption.yes, abuse: Option.family_member },
    { answer: CommonOption.no, abuse: Option.intimate_partner },
  ]) {
    test(`offence-analysis-impact: answered ${answer}, domestic abuse against a ${abuse}`, async ({
      page,
      openSection,
    }) => {
      const section = await openSection(offence, answers)
      const offenceAnalysisPage = new OffenceAnalysisPage(page)
      const { questions } = offenceAnalysisPage
      await page.goto(`${section}/${Step.offence_analysis_impact.path}`)

      await questions.offence_analysis_leader.option(answer).check()
      await questions.offence_analysis_impact_on_victims.option(answer).check()
      await questions.offence_analysis_accept_responsibility.option(answer).check()
      await questions.offence_analysis_escalation.option(answer).check()
      await questions.offence_analysis_risk.option(answer).check()
      await questions.offence_analysis_perpetrator_of_domestic_abuse.option(CommonOption.yes).check()
      await questions.offence_analysis_perpetrator_of_domestic_abuse_type.option(abuse).check()
      await questions.offence_analysis_victim_of_domestic_abuse.option(CommonOption.yes).check()
      await questions.offence_analysis_victim_of_domestic_abuse_type.option(abuse).check()

      await expectTheLimitsOnThePage(offenceAnalysisPage, { save: offenceAnalysisPage.markComplete })
    })
  }

  test('offence-analysis-impact: domestic abuse against a family member and an intimate partner', async ({
    page,
    openSection,
  }) => {
    const section = await openSection(offence, answers)
    const offenceAnalysisPage = new OffenceAnalysisPage(page)
    const { questions } = offenceAnalysisPage
    await page.goto(`${section}/${Step.offence_analysis_impact.path}`)

    await questions.offence_analysis_perpetrator_of_domestic_abuse.option(CommonOption.yes).check()
    await questions.offence_analysis_perpetrator_of_domestic_abuse_type
      .option(Option.family_member_and_intimate_partner)
      .check()
    await questions.offence_analysis_victim_of_domestic_abuse.option(CommonOption.yes).check()
    await questions.offence_analysis_victim_of_domestic_abuse_type
      .option(Option.family_member_and_intimate_partner)
      .check()

    await expectTheLimitsOnThePage(offenceAnalysisPage, { save: offenceAnalysisPage.markComplete })
  })
})
