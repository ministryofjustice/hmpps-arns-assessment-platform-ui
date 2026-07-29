/** Port of oasys/datamapping/MappingProvider.kt. */

import { MappingNotFoundException } from './exceptions'
import type { SectionMapping } from './common/sectionMapping'
import { Accommodation } from './v1/accommodation'
import { AlcoholMisuse } from './v1/alcoholMisuse'
import { Attitudes } from './v1/attitudes'
import { Drugs } from './v1/drugs'
import { Education } from './v1/education'
import { EmotionalWellbeing } from './v1/emotionalWellbeing'
import { FinancialManagement } from './v1/financialManagement'
import { LifestyleAssociates } from './v1/lifestyleAssociates'
import { NewSections } from './v1/newSections'
import { OffenceAnalysis } from './v1/offenceAnalysis'
import { Predictors } from './v1/predictors'
import { Relationships } from './v1/relationships'
import { ThinkingBehaviours } from './v1/thinkingBehaviours'

const versions: Record<string, SectionMapping[]> = {
  '1.0': [
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
