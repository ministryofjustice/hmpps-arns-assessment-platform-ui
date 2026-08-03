import {
  GovUKDateInputFull,
  GovUKDetails,
  GovUKHeading,
  GovUKInsetText,
  GovUKRadioInput,
  GovUKTextInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'

export const sexualOffendingInsetField = GovUKInsetText({
  text: 'These questions calculate sexual reoffending predictor scores. Use the guidance provided to decide if an offence should be counted. Do not use your professional judgement to reclassify anf offences.',
})

export const currentAndRecentSexualOffendingHeadingField = GovUKHeading({
  text: 'Current and recent sexual offending',
  size: 'm',
})

export const currentOffenceSexualRadioField = GovUKRadioInput({
  code: 'current-offence-sexually-motivated',
  fieldset: {
    legend: {
      html: '<h1 class="govuk-fieldset__heading">Does NAME&apos;s current offence have a sexual motivation?</h1>',
      classes: 'govuk-fieldset__legend--s',
    },
  },
  classes: 'govuk-radios--inline',
  items: [
    { value: 'true', text: 'Yes' },
    { value: 'false', text: 'No' },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
  ],
})

export const dateOfMostRecentSexualOffenceField = GovUKDateInputFull({
  code: 'date-of-most-recent-sexual-offence',
  fieldset: {
    legend: {
      html: '<h1 class="govuk-fieldset__heading">What is the date of NAME&apos;s most recent sanction involving a sexual or sexually motivated offence?</h1>',
      classes: 'govuk-fieldset__legend--s',
    },
  },
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
    validation({
      condition: Self().match(Condition.Date.IsValid()),
      message: 'Please enter a valid date',
    }),
  ],
})

export const sectionBreakField = HtmlBlock({
  content: '<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">',
})

export const directContactSexualOffendingHeadingField = GovUKHeading({
  text: 'Direct contact sexual or sexually motivated offending',
  size: 'm',
})

export const contactSanctionsField = GovUKTextInput({
  code: 'number-of-contact-sexual-sanctions',
  label: {
    text: `How many sanctions does NAME have for contact adult sexual or sexually motivated offences?`,
    classes: 'govuk-label--s',
  },
  hint: 'Include their current offence',
  classes: 'govuk-input--width-5',
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Offence code is a required field',
    }),
  ],
})

export const contactSexualDetailsField = GovUKDetails({
  summaryText: 'Offences that should be counted as contact adult sexual or sexually motivated',
  html:
    '<p class="govuk-body">Count sanctions if victims were aged 16 or over, unless the offence specifically refers to a victim aged ‘16 or 17’ or ‘13 to 17’. In these cases, a victim aged 16 or 17 is considered a child.</p>\n' +
    '<p class="govuk-body">Count the following offences:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>rape</li>\n' +
    '  <li>buggery or attempted buggery</li>\n' +
    '  <li>sexual assault on a male</li>\n' +
    '  <li>sexual assault on a female</li>\n' +
    '  <li>causing a female to engage in sexual activity without consent</li>\n' +
    '  <li>sex with an adult relative</li>\n' +
    '  <li>abduction (under the Sexual Offences 1956 Act)</li>\n' +
    '  <li>sexual activity with someone with a mental disorder or learning disability, including ‘breach of trust’ offences</li>\n' +
    '  <li>trafficking for sexual exploitation</li>\n' +
    '  <li>administering a substance with intent</li>\n' +
    '</ul>\n' +
    '<p class="govuk-body">If an offence is not listed above, it should still be counted if:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>you have explicit evidence that is has a sexual motivation</li>\n' +
    '  <li>there is physical contact with an adult victim</li>\n' +
    '</ul>\n' +
    '<p class="govuk-body">Do not count:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>offences related to paying for or being paid for sex </li>\n' +
    '  <li>breach offences</li>\n' +
    '</ul>',
})

export const contactChildSanctionsField = GovUKTextInput({
  code: 'number-of-contact-child-sexual-sanctions',
  label: {
    text: `How many sanctions does NAME have for direct contact child sexual or sexually motivated offences?`,
    classes: 'govuk-label--s',
  },
  hint: 'Include their current offence',
  classes: 'govuk-input--width-5',
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Offence code is a required field',
    }),
  ],
})

export const contactChildSexualDetailsField = GovUKDetails({
  summaryText: 'Offences that should be counted as direct contact child sexual or sexually motivated',
  html:
    '<p class="govuk-body">Count sanctions for the following offences where the victim is under 16, unless it is specified that victim can be under 18:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>rape</li>\n' +
    '  <li>attempted rape</li>\n' +
    '  <li>sexual assault</li>\n' +
    '  <li>indecent assault</li>\n' +
    '  <li>assault by penetration</li>\n' +
    '  <li>causing a female to engage in sexual activity without consent</li>\n' +
    '  <li>sexual activity with a child family member with victim aged under 18</li>\n' +
    '  <li>inciting a child family member to engage in sexual activity</li>\n' +
    '  <li>abuse of trust sexual offences with victim aged under 18</li>\n' +
    '  <li>abduction (under the Sexual Offences 1956 Act)</li>\n' +
    '  <li>trafficking for sexual exploitation</li>\n' +
    '  <li>buggery or attempted buggery</li>\n' +
    '  <li>administering a substance with intent</li>\n' +
    '  <li>gross indecency with a male aged under 18</li>\n' +
    '  <li>paying for sex with victims aged under 18 </li>\n' +
    '</ul>\n' +
    '<p class="govuk-body">If an offence is not listed above, it should still be counted if:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>you have explicit evidence that is has a sexual motivation</li>\n' +
    '  <li>there is physical contact with a child victim</li>\n' +
    '</ul>\n' +
    '<p class="govuk-body">Do not count breach offences.</p>\n',
})

export const victimStrangerField = GovUKRadioInput({
  code: 'victim-stranger',
  fieldset: {
    legend: {
      html: '<h1 class="govuk-fieldset__heading">Does NAME&apos;s current offence involve actual or attempted direct contact against a victim who was a stranger?</h1>',
      classes: 'govuk-fieldset__legend--s',
    },
  },
  classes: 'govuk-radios--inline',
  items: [
    { value: 'true', text: 'Yes' },
    { value: 'false', text: 'No' },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
  ],
})

export const victimStrangerDetailsField = GovUKDetails({
  summaryText: 'When to answer yes to this question',
  html:
    `<p class="govuk-body">Only answer ‘yes’ if the current offence is classed as direct contact <span class="govuk-!-font-weight-bold">and</span> the victim was a stranger.</p>\n` +
    '<p class="govuk-body govuk-!-font-weight-bold">How direct contact is defined</p>\n' +
    '<p class="govuk-body">Direct contact is defined by there being actual or attempted direct contact with a live human being. Offences include rape and sexual assault.  </p>\n' +
    '<p class="govuk-body govuk-!-font-weight-bold">How a stranger is defined</p>\n' +
    '<p class="govuk-body">The victim counts as a stranger if either:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>the victim did not know the offender 24 hours before the offence</li>\n' +
    '  <li>the offender did not know the victim 24 hours before the offence</li>\n' +
    '</ul>\n' +
    '<p class="govuk-body">To &apos;know&apos; a person, they must:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>have met the person face to face or on a video call</li>\n' +
    '  <li>have had a conversation with them face to face or on a video call</li>\n' +
    '  <li>be able to recognise the other person</li>\n' +
    '</ul>\n',
})

export const imagesAndIndirectContactHeadingField = GovUKHeading({
  text: 'Images and indirect contact sexual or sexually motivated offending',
  size: 'm',
})

export const indecentImagesOfChildrenField = GovUKTextInput({
  code: 'indecent-child-images',
  label: {
    text: `How many sanctions does NAME have for indecent child image, or indirect contact child, sexual or sexually motivated offences?`,
    classes: 'govuk-label--s',
  },
  hint: 'Include their current offence',
  classes: 'govuk-input--width-5',
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Offence code is a required field',
    }),
  ],
})

export const indecentImagesOfChildrenDetailsField = GovUKDetails({
  summaryText:
    'Offences that should be counted as indecent child image, or indirect contact, sexual or sexually motivated',
  html:
    '<p class="govuk-body govuk-!-font-weight-bold">Indecent child image offences</p>\n' +
    '<p class="govuk-body">Count sanctions for the following offences:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>taking, permitting to be taken, or making, distributing, or publishing indecent photographs or pseudo photographs (for example, AI generated) of children</li>\n' +
    '  <li>possession of an indecent photograph of a child</li>\n' +
    '  <li>possessing prohibited images of children</li>\n' +
    '</ul>\n' +
    '<p class="govuk-body govuk-!-font-weight-bold">Indirect child contact offences</p>\n' +
    '<p class="govuk-body">Count sanctions for the following offences:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>causing or inciting a child to engage in sexual activity</li>\n' +
    '  <li>engaging in sexual activity in the presence of a child under 13 (offender aged 18 or over)</li>\n' +
    '  <li>causing a child under 13 to watch a sexual act (offender aged 18 or over)</li>\n' +
    '  <li>meeting a child following sexual grooming</li>\n' +
    '  <li>sexual communication with a child</li>\n' +
    '</ul>\n' +
    '<p class="govuk-body">These can include acts committed in person or online. </p>\n' +
    '<p class="govuk-body">Do not count breach offences. </p>\n',
})

export const nonContactField = GovUKTextInput({
  code: 'non-contact',
  label: {
    text: `How many sanctions does NAME have for other non-contact sexual or sexually motivated offences`,
    classes: 'govuk-label--s',
  },
  hint: 'Include their current offence',
  classes: 'govuk-input--width-5',
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Offence code is a required field',
    }),
  ],
})

export const nonContactDetailsField = GovUKDetails({
  summaryText: 'Offences that should be counted as other non-contact sexual or sexually motivated',
  html:
    '<p class="govuk-body">These are sexual offences that do not involve:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>contact</li>\n' +
    '  <li>images of children</li>\n' +
    '  <li>indirect contact with children</li>\n' +
    '</ul>\n' +
    '<p class="govuk-body">Count sanctions for the following offences:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>possession of extreme pornographic images</li>\n' +
    '  <li>sending, photographing or filming of genitals</li>\n' +
    '  <li>sharing or threatening to share intimate photograph or film</li>\n' +
    '  <li>sex in a public lavatory</li>\n' +
    '  <li>exposure</li>\n' +
    '  <li>voyeurism</li>\n' +
    '  <li>sending etc photograph or film of genitals</li>\n' +
    '  <li>sharing or threatening to share intimate photograph or film</li>\n' +
    '  <li>offences relating to using equipment to film or observe another while breastfeeding</li>\n' +
    '  <li>intercourse with an animal</li>\n' +
    '  <li>sexual penetration of a corpse</li>\n' +
    '</ul>\n' +
    '<p class="govuk-body">If an offence is not listed above, it should still be counted if:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>you have explicit evidence that is has a sexual motivation</li>\n' +
    '  <li>there is no actual contact or intent to have contact with a live human being</li>\n' +
    '</ul>\n' +
    '<p class="govuk-body">Do not count:</p>\n' +
    '<ul class="govuk-list govuk-list--bullet">\n' +
    '  <li>offences related to paying for or being paid for sex</li>\n' +
    '  <li>breach offences</li>\n' +
    '  <li>convictions under the Criminal Justice and Courts Act 2015</li>\n' +
    '</ul>\n',
})
