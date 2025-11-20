export interface Answers {
  [key: string]: string[]
}

export interface Properties {
  [key: string]: string[]
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
