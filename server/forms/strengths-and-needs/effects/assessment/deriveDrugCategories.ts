import { Drug, drugsList, otherDrugOption } from '../../versions/v1.0/journeys/drug-use/constants'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'

const allDrugs = [...drugsList, otherDrugOption]
const drugByValue = new Map(allDrugs.map(drug => [drug.value, drug]))

export const deriveDrugCategories =
  (_deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
    const selectedDrugs = context.getAnswer('select_misused_drugs') as string[] | undefined

    if (!selectedDrugs?.length) {
      context.setData('drugsUsedInLastSix', [])
      context.setData('drugsUsedMoreThanSix', [])
      context.setData('injectableSelectedDrugs', [])

      return
    }

    const usedInLastSix: Drug[] = []
    const usedMoreThanSix: Drug[] = []
    const injectableSelected: Drug[] = []

    const resolveDrug = (drugValue: string): Drug | undefined => {
      const drug = drugByValue.get(drugValue)

      if (!drug) {
        return undefined
      }

      if (drug.value === otherDrugOption.value) {
        return { ...drug, text: (context.getAnswer('other_drug_name') as string) ?? drug.text }
      }

      return drug
    }

    selectedDrugs.forEach(drugValue => {
      const drug = resolveDrug(drugValue)

      if (!drug) {
        return
      }

      const lastUsed = context.getAnswer(`drug_last_used_${drugValue.toLowerCase()}`) as string | undefined

      if (lastUsed === 'LAST_SIX') {
        usedInLastSix.push(drug)
      } else if (lastUsed === 'MORE_THAN_SIX') {
        usedMoreThanSix.push(drug)
      }

      if (drug.injectable) {
        injectableSelected.push(drug)
      }
    })

    context.setData('drugsUsedInLastSix', usedInLastSix)
    context.setData('drugsUsedMoreThanSix', usedMoreThanSix)
    context.setData('injectableSelectedDrugs', injectableSelected)
  }
