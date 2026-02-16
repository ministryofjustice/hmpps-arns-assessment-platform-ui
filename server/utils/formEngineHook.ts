import FormEngine from '@form-engine/core/FormEngine'
import { JourneyDefinition } from '@form-engine/form/types/structures.type'
import { FormPackage } from '@form-engine/core/types/engine.type'
import { StructureType } from '@form-engine/form/types/enums'
import { migrateToV4Journey } from '../forms/sentence-plan/versions/migration/journey'
import { createVariant, VariantConfig } from '../routes/testutils/createVariant'

export default function runOptionalTestFormEngineHook(formEngine: FormEngine, journeyDefinition: JourneyDefinition) {
  const configV3: VariantConfig = {
    enabled: true, // process.env.PLAYWRIGHT === 'true',
    journeyOverrides: {
      '': {
        code: 'sentence-plan-v3',
        path: '/sentence-plan/v3.0',
        title: 'Sentence Plan',
        entryPath: '/v3.0/plan/overview',
      },
    },
    journeyAdditions: {
      '': {
        type: StructureType.JOURNEY,
        code: '',
        path: '',
        title: '',
        children: [migrateToV4Journey],
      },
    },
    stepOverrides: {
      // This can go, was just an example.
      '/goal/:uuid/add-steps': {
        title: 'Add Actions',
      },
    },
  }

  // journeyRemovals: ['/sentence-plan/v3.0/privacy', '/sentence-plan/v3.0/unsaved-information-deleted'], Doesn't work...

  const configV4: VariantConfig = {
    enabled: true, // process.env.PLAYWRIGHT === 'true',
    journeyOverrides: {
      '': {
        code: 'sentence-plan-v4',
        path: '/sentence-plan/v4.0',
        title: 'Sentence Plan',
        entryPath: '/v4.0/plan/overview',
      },
    },
  }

  // Create synthetic versions for testing
  // Should I just fake v3 and v4, and put migration on those?
  const variantV3 = createVariant(journeyDefinition, configV3) as FormPackage
  formEngine.registerFormPackage(variantV3)

  const variantV4 = createVariant(journeyDefinition, configV4) as FormPackage
  formEngine.registerFormPackage(variantV4)
}
