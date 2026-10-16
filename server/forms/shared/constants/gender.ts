export const Gender = {
  NOT_KNOWN: 'NOT_KNOWN',
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  NOT_SPECIFIED: 'NOT_SPECIFIED',
} as const

export type Gender = (typeof Gender)[keyof typeof Gender]

export type HandoverGenderCode = '0' | '1' | '2' | '9'

const GENDER_BY_CODE: Record<string, Gender> = {
  '0': Gender.NOT_KNOWN,
  '1': Gender.MALE,
  '2': Gender.FEMALE,
  '9': Gender.NOT_SPECIFIED,
}

const LABEL_BY_GENDER: Record<Gender, string> = {
  [Gender.NOT_KNOWN]: 'Not known',
  [Gender.MALE]: 'Male',
  [Gender.FEMALE]: 'Female',
  [Gender.NOT_SPECIFIED]: 'Not specified',
}

export const genderFromHandoverCode = (value: string | number | undefined): Gender =>
  GENDER_BY_CODE[String(value)] ?? Gender.NOT_KNOWN

export const handoverGenderLabel = (value: string | number | undefined): string =>
  LABEL_BY_GENDER[genderFromHandoverCode(value)]

export const handoverGenderCodes = Object.keys(GENDER_BY_CODE) as HandoverGenderCode[]

export const handoverGenderOptions = handoverGenderCodes.map(code => ({
  value: code,
  text: handoverGenderLabel(code),
}))
