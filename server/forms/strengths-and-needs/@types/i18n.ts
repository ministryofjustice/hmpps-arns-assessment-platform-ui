export interface Content {
  [key: string]: string | Content
}

export type ContentPath = string | string[]
