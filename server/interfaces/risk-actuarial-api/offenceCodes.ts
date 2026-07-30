export type ActuarialCategory =
  | 'UNKNOWN'
  | 'BURGLARY_DOMESTIC'
  | 'BURGLARY_OTHER'
  | 'DRUNKENNESS'
  | 'DRINK_DRIVING'
  | 'MOTORING_OFFENCES'
  | 'VEHICLE_RELATED_THEFT'
  | 'FRAUD_AND_FORGERY'
  | 'WELFARE_FRAUD'
  | 'DRUG_IMPORT_EXPORT_OR_PRODUCTION'
  | 'DRUG_POSSESSION_OR_SUPPLY'
  | 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS'
  | 'VIOLENCE_AGAINST_THE_PERSON_SUB_ABH'
  | 'PUBLIC_ORDER_AND_HARRASSMENT'
  | 'WEAPONS_NON_FIREARM'
  | 'FIREARMS_MOST_SERIOUS'
  | 'FIREARMS_OTHER'
  | 'HANDLING_STOLEN_GOODS'
  | 'CRIMINAL_DAMAGE'
  | 'ACQUISITIVE_VIOLENCE'
  | 'OTHER_OFFENCES'
  | 'ABSCONDING_OR_BAIL'
  | 'SEXUAL_AGAINST_CHILD'
  | 'SEXUAL_NOT_AGAINST_CHILD'
  | 'THEFT_NON_MOTOR'

export interface OffenceCodeFlags {
  opdViolenceSex: boolean
  isViolentSanction: boolean
}

export interface OffenceCodeDetails {
  parentGroupDescription: string
  categoryDescription: string
  subCategoryDescription: string
  actuarialCategory: ActuarialCategory
  flags: OffenceCodeFlags
}

export interface OffenceCodesResponse {
  offenceCodes: Record<string, OffenceCodeDetails>
}
