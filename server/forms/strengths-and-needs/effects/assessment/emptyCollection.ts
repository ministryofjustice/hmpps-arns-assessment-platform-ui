import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { Collection } from '../../constants/collection'
import { Question } from '../../versions/v1.0/journeys/offence-analysis/constants/question'
import { Option } from '../../versions/v1.0/journeys/offence-analysis/constants/option'
import { RemoveCollectionItemCommand } from '../../../../interfaces/aap-api/command';

export const emptyCollection =
  (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext, collection: Collection) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    const assessment = context.getData('assessment')
    const collections = assessment.collections
    const foundCollection = collections.find(it => it.name === collection.name) ?? null
    const whoWasTheVictim = (context.getAnswer(Question.offence_analysis_who_was_the_victim) as string[]) || undefined

    if (
      whoWasTheVictim === undefined
      || whoWasTheVictim.includes(Option.one_or_more_person)
      || !foundCollection // Collections are created lazily, so an absent collection is already empty.
    ) {
      return
    }

    await deps.api.executeCommands(
      ...foundCollection.items.map((item): RemoveCollectionItemCommand =>
        ({
          type: 'RemoveCollectionItemCommand',
          collectionItemUuid: item.uuid,
          assessmentUuid,
          user,
        })
      ),
    )
  }
