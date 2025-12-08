export interface Value {
  type: string
}

export interface SingleValue extends Value {
  type: 'SingleValue'
  value: string
}

export interface MultiValue extends Value {
  type: 'MultiValue'
  values: string[]
}

export type Values = SingleValue | MultiValue

export interface Answers {
  [key: string]: Values
}

export interface Properties {
  [key: string]: Values
}

export type QuestionCodes = Array<string>

export type PropertyKeys = Array<string>

export interface CollectionItem {
  uuid: string
  createdAt: string
  updatedAt: string
  answers: Answers
  properties: Properties
}

export interface Collection {
  uuid: string
  createdAt: string
  updatedAt: string
  name: string
  items: CollectionItem[]
}

export interface TimelineItem {
  type: string
  createdAt: string
  data: Record<string, any>
}
