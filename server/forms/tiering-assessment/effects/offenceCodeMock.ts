import {
  ConditionFunctionExpr,
  FunctionType,
  ResolvableValue,
  TransformerFunctionExpr
} from "@ministryofjustice/hmpps-forge/core/authoring";

export const offenceCodeMock = {
  "00000": {
    "parentGroupDescription": "Other summary offences",
    "categoryDescription": "Invalid Offence",
    "subCategoryDescription": "Invalid Offence",
    "actuarialCategory": "UNKNOWN",
    "flags": {
      "opdViolenceSex": false,
      "isViolentSanction": false
    }
  },
  "00100": {
    "parentGroupDescription": "Violence against the person",
    "categoryDescription": "Murder",
    "subCategoryDescription": "Murder    [Use this code only if you are unable to determine which subcoded Offence applies]",
    "actuarialCategory": "VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS",
    "flags": {
      "opdViolenceSex": true,
      "isViolentSanction": true
    }
  },
  "02801": {
    "parentGroupDescription": "Burglary",
    "categoryDescription": "Burglary in a dwelling",
    "subCategoryDescription": "Burglary with the intent to commit an offence triable only on indictment",
    "actuarialCategory": "BURGLARY_DOMESTIC",
    "flags": {
      "opdViolenceSex": false,
      "isViolentSanction": false
    }
  },
  "03001": {
    "parentGroupDescription": "Burglary",
    "categoryDescription": "Burglary, other than in a dwelling",
    "subCategoryDescription": "Burglary, with the intent to commit or the commission of an offence triable only on indictment",
    "actuarialCategory": "BURGLARY_OTHER",
    "flags": {
      "opdViolenceSex": false,
      "isViolentSanction": false
    }
  },
  "09943": {
    "parentGroupDescription": "Other indictable",
    "categoryDescription": "Other indictable offences",
    "subCategoryDescription": "Drunkenness in aircraft (including drugs)",
    "actuarialCategory": "DRUNKENNESS",
    "flags": {
      "opdViolenceSex": false,
      "isViolentSanction": true
    }
  },
  "00406": {
    "parentGroupDescription": "Violence against the person",
    "categoryDescription": "Manslaughter etc",
    "subCategoryDescription": "Causing death by careless driving when under the influence of drink or drugs",
    "actuarialCategory": "DRINK_DRIVING",
    "flags": {
      "opdViolenceSex": false,
      "isViolentSanction": false
    }
  },
  "00404": {
    "parentGroupDescription": "Violence against the person",
    "categoryDescription": "Manslaughter etc",
    "subCategoryDescription": "Causing death by dangerous driving",
    "actuarialCategory": "MOTORING_OFFENCES",
    "flags": {
      "opdViolenceSex": false,
      "isViolentSanction": false
    }
  },
  "03701": {
    "parentGroupDescription": "Theft and handling",
    "categoryDescription": "Aggravated Taking of a Vehicle",
    "subCategoryDescription": "Aggravated Taking of a Vehicle: Where, owing to the driving of the vehicle, an accident occurs causing the death of any person",
    "actuarialCategory": "VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS",
    "flags": {
      "opdViolenceSex": false,
      "isViolentSanction": true
    }
  },
  "03801": {
    "parentGroupDescription": "Theft and handling",
    "categoryDescription": "Money Laundering offences (not drugs)",
    "subCategoryDescription": "Concealing or transferring proceeds of criminal conduct",
    "actuarialCategory": "FRAUD_AND_FORGERY",
    "flags": {
      "opdViolenceSex": false,
      "isViolentSanction": false
    }
  },
  "05333": {
    "parentGroupDescription": "Fraud forgery",
    "categoryDescription": "Other Frauds",
    "subCategoryDescription": "Dishonest representation for obtaining benefit etc.",
    "actuarialCategory": "WELFARE_FRAUD",
    "flags": {
      "opdViolenceSex": false,
      "isViolentSanction": false
    }
  },
  "07750": {
    "parentGroupDescription": "Drug offences",
    "categoryDescription": "Misuse of Drugs",
    "subCategoryDescription": "Manufacturing a scheduled substance",
    "actuarialCategory": "DRUG_IMPORT_EXPORT_OR_PRODUCTION",
    "flags": {
      "opdViolenceSex": false,
      "isViolentSanction": false
    }
  },
  "09259": {
    "parentGroupDescription": "Drug offences",
    "categoryDescription": "Misuse of Drugs",
    "subCategoryDescription": "Having possession of a controlled drug - Class A - Other Class A",
    "actuarialCategory": "DRUG_POSSESSION_OR_SUPPLY",
    "flags": {
      "opdViolenceSex": false,
      "isViolentSanction": false
    }
  },
  "00101": {
    "parentGroupDescription": "Violence against the person",
    "categoryDescription": "Murder",
    "subCategoryDescription": "Murder of persons aged 1 year or over. Murder abroad by UK citizen. Genocide or crime against humanity",
    "actuarialCategory": "VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS",
    "flags": {
      "opdViolenceSex": true,
      "isViolentSanction": true
    }
  },
  "00821": {
    "parentGroupDescription": "Violence against the person",
    "categoryDescription": "Malicious wounding and other like offences",
    "subCategoryDescription": "Owner or person in charge allowing dog to be dangerously out of control in a public place injuring any person",
    "actuarialCategory": "VIOLENCE_AGAINST_THE_PERSON_SUB_ABH",
    "flags": {
      "opdViolenceSex": true,
      "isViolentSanction": true
    }
  },
  "00829": {
    "parentGroupDescription": "Violence against the person",
    "categoryDescription": "Malicious wounding and other like offences",
    "subCategoryDescription": "Breach of the conditions of an injunction against harassment (was breach of molestation order)",
    "actuarialCategory": "PUBLIC_ORDER_AND_HARRASSMENT",
    "flags": {
      "opdViolenceSex": true,
      "isViolentSanction": true
    }
  },
  "00811": {
    "parentGroupDescription": "Violence against the person",
    "categoryDescription": "Malicious wounding and other like offences",
    "subCategoryDescription": "Possession of offensive weapons without lawful authority or reasonable excuse",
    "actuarialCategory": "WEAPONS_NON_FIREARM",
    "flags": {
      "opdViolenceSex": true,
      "isViolentSanction": true
    }
  },
  "00514": {
    "parentGroupDescription": "Violence against the person",
    "categoryDescription": "Wounding and other acts endangering life",
    "subCategoryDescription": "Possession of firearms etc., with intent to endanger life (Group I)",
    "actuarialCategory": "FIREARMS_MOST_SERIOUS",
    "flags": {
      "opdViolenceSex": true,
      "isViolentSanction": true
    }
  },
  "08103": {
    "parentGroupDescription": "Other indictable",
    "categoryDescription": "Firearms Act 1968 and other Firearms Acts",
    "subCategoryDescription": "Possessing etc. firearms or ammunition without firearm certificate (Group I)",
    "actuarialCategory": "FIREARMS_OTHER",
    "flags": {
      "opdViolenceSex": true,
      "isViolentSanction": true
    }
  },
  "05401": {
    "parentGroupDescription": "Theft and handling",
    "categoryDescription": "Handling stolen goods",
    "subCategoryDescription": "Receiving stolen goods",
    "actuarialCategory": "HANDLING_STOLEN_GOODS",
    "flags": {
      "opdViolenceSex": false,
      "isViolentSanction": false
    }
  },
  "05601": {
    "parentGroupDescription": "Criminal damage",
    "categoryDescription": "Arson",
    "subCategoryDescription": "Arson endangering life",
    "actuarialCategory": "CRIMINAL_DAMAGE",
    "flags": {
      "opdViolenceSex": false,
      "isViolentSanction": true
    }
  },
  "03401": {
    "parentGroupDescription": "Robbery",
    "categoryDescription": "Robbery and assaults with intent to rob",
    "subCategoryDescription": "Robbery",
    "actuarialCategory": "ACQUISITIVE_VIOLENCE",
    "flags": {
      "opdViolenceSex": false,
      "isViolentSanction": true
    }
  },
  "00832": {
    "parentGroupDescription": "Violence against the person",
    "categoryDescription": "Malicious wounding and other like offences",
    "subCategoryDescription": "Breach of Anti-Social Behaviour Order (order made to protect from alarm, distress or harassment)",
    "actuarialCategory": "OTHER_OFFENCES",
    "flags": {
      "opdViolenceSex": false,
      "isViolentSanction": false
    }
  },
  "08001": {
    "parentGroupDescription": "Other indictable",
    "categoryDescription": "Participating in prison mutiny with or without failing to submit to lawful authority",
    "subCategoryDescription": "Participating in prison mutiny with or without failing to submit to lawful authority",
    "actuarialCategory": "ABSCONDING_OR_BAIL",
    "flags": {
      "opdViolenceSex": false,
      "isViolentSanction": false
    }
  },
  "01911": {
    "parentGroupDescription": "Sexual offences",
    "categoryDescription": "Rape",
    "subCategoryDescription": "Attempted rape of a female aged under 16",
    "actuarialCategory": "SEXUAL_AGAINST_CHILD",
    "flags": {
      "opdViolenceSex": true,
      "isViolentSanction": false
    }
  },
  "01602": {
    "parentGroupDescription": "Sexual offences",
    "categoryDescription": "Buggery and Attempted Buggery",
    "subCategoryDescription": "Buggery and Attempted Buggery: By a man with a male person of the age of sixteen or over without consent",
    "actuarialCategory": "SEXUAL_NOT_AGAINST_CHILD",
    "flags": {
      "opdViolenceSex": false,
      "isViolentSanction": false
    }
  },
  "04910": {
    "parentGroupDescription": "Theft and handling",
    "categoryDescription": "Other stealing and unauthorised taking",
    "subCategoryDescription": "Offences under the Theft Act 1968 S.1 not classified elsewhere",
    "actuarialCategory": "THEFT_NON_MOTOR",
    "flags": {
      "opdViolenceSex": false,
      "isViolentSanction": false
    }
  },
}

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
