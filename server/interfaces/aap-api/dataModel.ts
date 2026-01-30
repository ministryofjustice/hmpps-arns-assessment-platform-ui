export interface Value {
  type: string
}

export interface SingleValue extends Value {
  type: 'Single'
  value: string
}

export interface MultiValue extends Value {
  type: 'Multi'
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
  collections?: Collection[]
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
  user?: {
    id: string
    name: string
  }
}
