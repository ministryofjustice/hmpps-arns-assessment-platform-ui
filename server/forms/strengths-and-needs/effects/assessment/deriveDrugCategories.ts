import { Drug, drugsList, fieldCodeString } from '../../versions/v1.0/journeys/drug-use/constants'
import { Question } from '../../versions/v1.0/journeys/drug-use/constants/question'
import { Option } from '../../versions/v1.0/journeys/drug-use/constants/option'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'

const allDrugs = [...drugsList]
const drugByValue = new Map(allDrugs.map(drug => [drug.value, drug]))

export const deriveDrugCategories =
  (_deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
    const selectedDrugs = context.getAnswer(Question.select_misused_drugs) as string[] | undefined

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

      return drug
    }

    selectedDrugs.forEach(drugValue => {
      const drug = resolveDrug(drugValue)

      if (!drug) {
        return
      }

      const lastUsed = context.getAnswer(fieldCodeString(Question.drug_last_used, drugValue)) as string | undefined

      if (lastUsed === Option.last_six) {
        usedInLastSix.push(drug)
      } else if (lastUsed === Option.more_than_six) {
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
