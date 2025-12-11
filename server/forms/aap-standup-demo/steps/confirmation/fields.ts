import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { ArrayTransformers } from '@form-engine/registry/transformers/arrayTransformers'
import { Condition } from '@form-engine/registry/conditions'
import { Answer, block, Data, Format } from '@form-engine/form/builders'
import { when } from '@form-engine/form/builders/ConditionalExprBuilder'
import { StandupDemoTransformers } from '../../functions'
import { coldDecisionOptions, squad2ProgressOptions, squad4ProgressOptions, squadOptions } from '../../options'

export const confirmationPanel = block<HtmlBlock>({
  variant: 'html',
  content: `
    <div class="govuk-panel govuk-panel--confirmation">
      <h1 class="govuk-panel__title">Standup Complete</h1>
      <div class="govuk-panel__body">
        Your answers have been saved to the AAP backend
      </div>
    </div>
  `,
})

export const summaryHeading = block<HtmlBlock>({
  variant: 'html',
  content: `<h2 class="govuk-heading-m">Summary of your answers</h2>`,
})

export const answerSummary = block<HtmlBlock>({
  variant: 'html',
  content: Format(
    `
    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Standup decision</dt>
        <dd class="govuk-summary-list__value">%1</dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Target squad</dt>
        <dd class="govuk-summary-list__value">%2</dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Progress items</dt>
        <dd class="govuk-summary-list__value">%3</dd>
      </div>
    </dl>
    `,
    Answer('coldDecision').pipe(
      StandupDemoTransformers.MapKeysToLabels(coldDecisionOptions),
      ArrayTransformers.Join(', '),
    ),
    Answer('targetSquad').pipe(StandupDemoTransformers.MapKeysToLabels(squadOptions), ArrayTransformers.Join(', ')),
    when(Answer('squad4ProgressItems').match(Condition.IsRequired()))
      .then(
        Answer('squad4ProgressItems').pipe(
          StandupDemoTransformers.MapKeysToLabels(squad4ProgressOptions),
          StandupDemoTransformers.ToBulletList(),
        ),
      )
      .else(
        Answer('squad2ProgressItems').pipe(
          StandupDemoTransformers.MapKeysToLabels(squad2ProgressOptions),
          StandupDemoTransformers.ToBulletList(),
        ),
      ),
  ),
})

export const shoutOutStyles = block<HtmlBlock>({
  variant: 'html',
  content: Format(
    `
    <style nonce="%1">
      .shoutout {
        font-size: 1.5rem;
        font-weight: bold;
        background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000);
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: rainbow 3s linear infinite, wave 2s ease-in-out infinite;
      }
      @keyframes rainbow {
        0% { background-position: 0% center; }
        100% { background-position: 200% center; }
      }
      @keyframes wave {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
    </style>
    `,
    Data('cspNonce'),
  ),
})

export const shoutOut = block<HtmlBlock>({
  variant: 'html',
  content: Format(
    `<p class="shoutout">%1</p>`,
    when(Answer('targetSquad').match(Condition.Equals('koala')))
      .then('Huge shout out to the amazing Squad 4 developers: Alex, Lucas, Ben, Jean-Yves and Dimitar!')
      .else(
        when(Answer('targetSquad').match(Condition.Equals('phoenix')))
          .then('Huge shout out to the amazing Squad 2 developers: Jake, Iana, Nicola and Dami!')
          .else('How did you even get here?!'),
      ),
  ),
})

export const thankYou = block<HtmlBlock>({
  variant: 'html',
  content: Format(
    `<p class="govuk-body">%1</p>`,
    when(Answer('targetSquad').match(Condition.Equals('phoenix')))
      .then("I can't believe I'm ill this week. Sorry to Jake and Iana that I won't be able to do our catchup today!")
      .else("I can't believe I'm ill this week. Sorry to JY as I can't make our catchup today!"),
  ),
})

export const resetButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Start Fresh Demo',
  name: 'action',
  value: 'reset',
  classes: 'govuk-button--secondary',
})
