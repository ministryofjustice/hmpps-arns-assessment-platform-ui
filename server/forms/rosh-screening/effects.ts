import { buildEffectFunction, resolveInjectedEffectsType } from '@form-engine/registry/utils/buildEffect'

export interface RoshScreeningService {
  save(data: any): Promise<any>
}

export const roshScreeningEffects = {
  Save: (service: RoshScreeningService) =>
    buildEffectFunction('RoshScreeningSave', async (context: any) => {
      service.save(context.getAnswers())
    }),
}

export const RoshScreeningEffects = resolveInjectedEffectsType(roshScreeningEffects)
