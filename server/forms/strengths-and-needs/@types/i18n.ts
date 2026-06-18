export type ContentPath = string | string[]

export type Language = 'en-gb' | 'cy'

export type Locale = Record<Language, Record<string, any>>

export type Paths<T> = {

  [K in keyof T & string]:

  T[K] extends object

    ? `${K}.${Paths<T[K]>}`

    : K

}[keyof T & string]
