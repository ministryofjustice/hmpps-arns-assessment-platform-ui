export interface OffenceDetails {
  parentGroupDescription: string
  categoryDescription: string
  subCategoryDescription: string
  actuarialCategory: string
  flags: {
    opdViolenceSex: boolean
    isViolentSanction: boolean
  }
}
