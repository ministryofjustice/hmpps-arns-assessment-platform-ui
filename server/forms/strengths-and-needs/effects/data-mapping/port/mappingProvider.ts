/** Port of oasys/datamapping/MappingProvider.kt. */

import { MappingNotFoundException } from './exceptions'
import type { SectionMapping } from './common/sectionMapping'
import { Accommodation } from './v1.0/accommodation'
import { AlcoholMisuse } from './v1.0/alcoholMisuse'
import { Attitudes } from './v1.0/attitudes'
import { Drugs } from './v1.0/drugs'
import { Education } from './v1.0/education'
import { EmotionalWellbeing } from './v1.0/emotionalWellbeing'
import { FinancialManagement } from './v1.0/financialManagement'
import { LifestyleAssociates } from './v1.0/lifestyleAssociates'
import { NewSections } from './v1.0/newSections'
import { OffenceAnalysis } from './v1.0/offenceAnalysis'
import { Predictors } from './v1.0/predictors'
import { Relationships } from './v1.0/relationships'
import { ThinkingBehaviours } from './v1.0/thinkingBehaviours'

const versions: Record<string, SectionMapping[]> = {
  'v1.0': [
    new Accommodation(),
    new AlcoholMisuse(),
    new Attitudes(),
    new Drugs(),
    new Education(),
    new EmotionalWellbeing(),
    new FinancialManagement(),
    new LifestyleAssociates(),
    new NewSections(),
    new OffenceAnalysis(),
    new Predictors(),
    new Relationships(),
    new ThinkingBehaviours(),
  ],
}

export class MappingProvider {
  get(formVersion: string): SectionMapping[] {
    const mapping = versions[formVersion]
    if (!mapping) {
      throw new MappingNotFoundException(formVersion)
    }
    return mapping
  }
}
