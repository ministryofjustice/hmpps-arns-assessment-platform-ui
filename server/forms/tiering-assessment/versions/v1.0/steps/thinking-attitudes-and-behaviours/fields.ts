import { GovUKDetails, GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Condition, Format, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'

export const regularOffendingActivitiesField = GovUKRadioInput({
  code: 'regular-offending-activities',
  fieldset: {
    legend: {
      text: Format('Does %1 engage in activities that could link to offending?', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    {
      value: 'NO_PROBLEMS',
      text: 'Engages in pro-social activities and understands the link to offending',
    },
    {
      value: 'SOME_PROBLEMS',
      text: 'Sometimes engages in activities linked to offending but recognises the link',
    },
    {
      value: 'SIGNIFICANT_PROBLEMS',
      text: 'Regularly engages in activities which encourage offending and is not aware or does not care about the link to offending',
    },
    {
      divider: 'or',
    },
    {
      value: 'unknown',
      text: 'Unknown',
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
  ],
})

export const regularOffendingActivitiesDetailsField = GovUKDetails({
  summaryText: 'Help to answer this question',
  html:
    '<p class="govuk-body">Consider:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>how and where they spend their time</li>\n' +
    '  <li>whether they spend a lot of time in situations that provide the opportunity to offend</li>\n' +
    '  <li>how well they recognise the places and activities they will need to avoid</li>\n' +
    '</ul>\n' +
    '<p class="govuk-body govuk-!-font-weight-bold">Engages in pro-social activities and understands the link to offending</p>\n' +
    '<p class="govuk-body">Select this option if you feel that they:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>will not knowingly mix with others with criminal behaviours or spend time in places where they congregate</li>\n' +
    '  <li>recognise which social factors contribute to their offending</li>\n' +
    '  <li>avoid situations that might provide an opportunity to offend</li>\n' +
    '</ul>\n' +
    '<p class="govuk-body">They may have placed themselves at risk in the past but there will be recent evidence of change (for example, change in associates or activities).</p>\n' +
    '<p class="govuk-body govuk-!-font-weight-bold">Sometimes engages in activities linked to offending but recognise the link</p>\n' +
    '<p class="govuk-body">Select this option if you feel that they recognise the link between their activities and their offending behaviour, but may minimise this or believe they do not have an alternative</p>\n' +
    '<p class="govuk-body govuk-!-font-weight-bold">Regularly engages in activities which encourage offending and is not aware or does not care about the link to offending</p>\n' +
    '<p class="govuk-body">Select this option if you feel that they:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>may not be aware or may not care about the link to offending</li>\n' +
    '  <li>constantly place themselves in situations that increase the risk of re-offending and choose to ignore this</li>\n' +
    '</ul>\n',
})

export const temperControlField = GovUKRadioInput({
  code: 'temper-control',
  fieldset: {
    legend: {
      text: Format('Is %1 able to manage their temper?', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    {
      value: 'NO_PROBLEMS',
      text: 'Yes, is able to manage their temper well',
    },
    {
      value: 'SOME_PROBLEMS',
      text: 'Sometimes has outbreaks of uncontrolled anger',
    },
    {
      value: 'SIGNIFICANT_PROBLEMS',
      text: 'No, easily loses their temper',
      hint: 'This may result in a loss of control or inability to stay calm until they have expressed their anger',
    },
    {
      divider: 'or',
    },
    {
      value: 'unknown',
      text: 'Unknown',
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
  ],
})

export const temperControlDetailsField = GovUKDetails({
  summaryText: 'Help to answer this question',
  html:
    '<p class="govuk-body">Consider:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>if they have a low tolerance for frustration, poor resolution conflict skills, and lose their temper regularly and easily</li>\n' +
    '  <li>whether they have a hidden disability, which may impact on communication and sometimes lead to frustration and loss of temper</li>\n' +
    '  <li>how well they deal with negative emotions and frustrating situations, which can often lead to acts of violence</li>\n' +
    '</ul>\n' +
    '<p class="govuk-body govuk-!-font-weight-bold">Yes, is able to manage their temper well</p>\n' +
    '<p class="govuk-body">Select this option if you feel that they:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>do not experience feelings of being totally out of control when angry</li>\n' +
    '  <li>recognise events and situations that irritate them and deal with them effectively</li>\n' +
    '  <li>do not become so angry that they have assaulted someone or damaged property</li>\n' +
    '</ul>\n' +
    '<p class="govuk-body govuk-!-font-weight-bold">No, easily loses their temper</p>\n' +
    '<p class="govuk-body">Select this option if you feel that they:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>have a history of regular outbreaks of anger</li>\n' +
    '  <li>constantly place themselves in situations that increase the risk of re-offending and choose to ignore this</li>\n' +
    '  <li>admit to losing their temper easily</li>\n' +
    '  <li>cause other people to be very wary of them</li>\n' +
    '  <li>assault others when angry or smash property</li>\n' +
    '  <li>describe a total loss of control when feeling angry</li>\n' +
    '  <li>have an inability to remain calm until they have expressed their anger</li>\n' +
    '  <li>frequently becoming angry under specific circumstances or when disinhibited by alcohol or drugs</li>\n' +
    '</ul>\n' +
    '<p class="govuk-body">A history of violent behaviour itself does not indicate issues with temper control. Many individuals use violence in a controlled instrumental way. Do not select this option if they describe themselves as angry but do not lose control.</p>\n',
})

export const impulsivityProblemsField = GovUKRadioInput({
  code: 'impulsivity-problems',
  fieldset: {
    legend: {
      text: Format('Does %1 act on impulse?', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    {
      value: 'NO_PROBLEMS',
      text: 'Considers all aspects of a situation before acting on or making a decision',
    },
    {
      value: 'SOME_PROBLEMS',
      text: 'Sometimes acts on impulse which causes problems',
    },
    {
      value: 'SIGNIFICANT_PROBLEMS',
      text: 'Acts on impulse which causes significant problems',
    },
    {
      divider: 'or',
    },
    {
      value: 'unknown',
      text: 'Unknown',
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
  ],
})

export const impulsivityProblemsDetailsField = GovUKDetails({
  summaryText: 'Help to answer this question',
  html:
    '<p class="govuk-body">Impulsive people:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>prefer to act rather than plan</li>\n' +
    '  <li>do not reflect and often regret their actions later</li>\n' +
    '  <li>are prone to boredom and require a high degree of external stimulation</li>\n' +
    '  <li>may describe dangerous situations as exciting and are natural risk-takers</li>\n' +
    '</ul>\n' +
    '<p class="govuk-body govuk-!-font-weight-bold">Considers all aspects of a situation before acting on or making a decision</p>\n' +
    '<p class="govuk-body">Select this option if you feel that they:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>very rarely do anything without fully considering all the aspects of the situation</li>\n' +
    '  <li>take decision-making seriously</li>\n' +
    '  <li>are unlikely to take huge risks for small gains</li>\n' +
    '  <li>are cautious about exposing themselves to risk</li>\n' +
    '  <li>correctly identify possible risks in any situation</li>\n' +
    '</ul>\n' +
    '<p class="govuk-body govuk-!-font-weight-bold">Sometimes acts on impulse which causes problems</p>\n' +
    '<p class="govuk-body">Select this option if you feel that they:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>complain that they become bored easily</li>\n' +
    '  <li>have a short attention span</li>\n' +
    '  <li>equate acting quickly with being decisive and positive</li>\n' +
    '  <li>seek immediate gratification, which often leads to offending</li>\n' +
    '  <li>regret many of their actions later</li>\n' +
    '</ul>\n' +
    '<p class="govuk-body govuk-!-font-weight-bold">Acts on impulse which causes significant problems</p>\n' +
    '<p class="govuk-body">Select this option if you feel that they:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    "  <li>claim that they 'just react'</li>\n" +
    '  <li>are unable to explain their actions</li>\n' +
    '  <li>get into trouble because they do not think through the possible consequences of their actions</li>\n' +
    '  <li>crave excitement, which may lead to the use of drugs, dangerous driving or other reckless activities</li>\n' +
    "  <li>offend 'on the spur of the moment'</li>\n" +
    '  <li>repeat the same mistakes because they fail to make the most of prior experience when making decisions</li>\n' +
    '</ul>\n',
})

export const proCriminalAttitudesField = GovUKRadioInput({
  code: 'pro-criminal-attitudes',
  fieldset: {
    legend: {
      text: Format('Does %1 support or excuse criminal behaviour?', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    {
      value: 'YES_IN_LAST_THREE_MONTHS',
      text: 'Does not support or excuse criminal behaviour',
    },
    {
      value: 'YES_NOT_IN_LAST_THREE_MONTHS',
      text: 'Sometimes supports or excuses criminal behaviour',
    },
    {
      value: 'NO',
      text: 'Supports or excuses criminal behaviour or their pattern of behaviour and other evidence indicates this is an issue',
    },
    {
      divider: 'or',
    },
    {
      value: 'unknown',
      text: 'Unknown',
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
  ],
})

export const proCriminalAttitudesDetailsField = GovUKDetails({
  summaryText: 'Help to answer this question',
  html:
    '<p class="govuk-body">Consider:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>their attitude towards offending, anti-social behaviour, and criminality in general</li>\n' +
    '  <li>any beliefs that any criminal behaviour is normal and acceptable (for example, they may hold attitudes that support or condone violence towards partners, exhibited through overtly expressed opinions, or through justifications and minimisations of such behaviour)</li>\n' +
    "  <li>If they excuse the levels of offending in terms of wider general factors such as levels of unemployment, the government's policies, or inequalities in society</li>\n" +
    '  <li>are they anti-authoritarian, dismissive of the judicial and law enforcement systems, such as the police, probation staff, prison staff, people who work in the courts, other agencies and organisations</li>\n' +
    '  <li>their attitude towards authority and whether this has been impacted by experiences of discrimination</li>\n' +
    '  <li>if they view those who abide by the law as being weak, inferior or foolish</li>\n' +
    '</ul>\n' +
    '<p class="govuk-body">Some people with an undiagnosed or unidentified condition (for example, learning disability or challenges, or Autism) might present with a more rigid way of thinking, which can easily be misinterpreted as unyielding and even anti-authoritarian.</p>\n' +
    '<p class="govuk-body">Also consider if they make broad generalisations to justify criminal behaviour such as:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    "  <li>'everybody's doing it'</li>\n" +
    "  <li>'nobody got hurt'</li>\n" +
    "  <li>victims 'only have themselves to blame'</li>\n" +
    "  <li>'they were trying to get a rise out of me'</li>\n" +
    "  <li>'I had no choice'</li>\n" +
    '</ul>\n' +
    '<p class="govuk-body govuk-!-font-weight-bold">Supports or excuses criminal behaviour or their pattern of behaviour and other evidence indicates this is an issue</p>\n' +
    '<p class="govuk-body">Select this option if you feel that they:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>express views favouring and excusing criminal behaviour regularly and with conviction, offering these views spontaneously during your contact with them</li>\n' +
    '  <li>show a great deal of antipathy towards the legal system and its agencies and strongly adhere to the views of a criminal sub-culture.</li>\n' +
    '  <li>may not overtly state pro-criminal attitudes, but their pattern of behaviour or other evidence indicates this is an issue</li>\n' +
    '</ul>\n' +
    '<p class="govuk-body govuk-!-font-weight-bold">Does not support or excuse criminal behaviour</p>\n' +
    '<p class="govuk-body">Select this option if you feel that:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>there is no evidence that they ally themselves with a criminal sub-culture</li>\n' +
    '  <li>their views about law and order are generally positive</li>\n' +
    '  <li>they recognise that most people are law-abiding</li>\n' +
    '  <li>they would recognise and respect the rule of law in general even if they demonstrate some distortions and minimisation around their own offences</li>\n' +
    '</ul>\n' +
    '<p class="govuk-body govuk-!-font-weight-bold">Individuals convicted of sexual offences</p>\n' +
    '<p class="govuk-body">You must be careful to avoid bias. People can commonly behave and act in opposition to their beliefs. This does not necessarily mean they have a generalised attitude that offending is acceptable; someone sexually offending does not automatically mean they believe that their behaviour was justified.</p>\n' +
    '<p class="govuk-body">They may minimise some of their behaviour (by providing excuses or reasons, or minimising aspects) to make it less painful for them to deal with, and so that others are more likely to deem their acts as permissible, and them as morally redeemable people.</p>\n' +
    '<p class="govuk-body govuk-!-font-weight-bold">Maintaining innocence</p>\n' +
    '<p class="govuk-body">They may maintain their innocence to protect their relationships with non-offending family others, which could have a role in supporting desistence. But, for a small number of people, maintaining innocence might be part of a strategy to retain access to potential victims, and so might be a risk factor. It is important; therefore, for assessors to determine the purpose that maintaining innocence might serve for the individual.</p>\n' +
    '<p class="govuk-body">Equally, maintaining innocence regarding their conviction does not necessarily mean the individual has pro-criminal attitudes. It may serve to protect their sense of identity and of being \'someone who would not do those things\' (they do not believe the behaviour is right) which is indicated as important for supporting the desistance related change processes.</p>\n' +
    '<p class="govuk-body govuk-!-font-weight-bold">Sharing true attitudes</p>\n' +
    "<p class=\"govuk-body\">Those with true attitudes that support sexual offending might in some cases find it difficult to contain them and so might share them. They may verbalise their views on the age of consent or their entitlement to sex. That is, if they have a partner, they may consider it their 'right' to have sex. Similarly, some may hold the belief that 'as a man I am entitled to sex'.</p>\n" +
    "<p class=\"govuk-body\">Considering the environment that the individual grew up and was socialised may help you understand someone's attitudes to sex, as opposed to making assumptions about beliefs based on gender. For example, you would not have to be male to hold the belief that 'men deserve sex from women'. Others may not share them because voicing such views might lead to them receiving further sanctions, or they realise they may be challenged over.</p>\n" +
    '<p class="govuk-body">Other evidence may come from observation of their discussion with other prisoners or residents about offence supportive beliefs or sayings. Any material collected during an investigation such as chat room transcripts and phone messages may also be useful. However, at the same time be mindful of the impact of peer influence, do they believe what they say/write, or do they offer it to fit in with peers? Where possible seek multiple sources and compare.</p>\n',
})
