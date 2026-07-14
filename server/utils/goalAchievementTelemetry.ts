export type GoalAchievementSelection = 'yes' | 'no'

export interface GoalAchievementRadioTelemetryEvent {
  name: `mark-goal-achieved-${GoalAchievementSelection}-radio`
  properties: {
    'Selected Value': string
    'Previous Value'?: string
  }
}

export interface GoalAchievementNoteTelemetryEvent {
  name: 'mark-goal-achieved-note'
  properties: {
    'Note Added': boolean
  }
}

const yesValue = 'Yes, mark as achieved'

const getSelectionValue = (selection: GoalAchievementSelection, noValue: string): string =>
  selection === 'yes' ? yesValue : noValue

const buildGoalAchievementRadioTelemetryEvent = (
  selection: GoalAchievementSelection,
  noValue: string,
  previousSelection?: GoalAchievementSelection,
): GoalAchievementRadioTelemetryEvent => ({
  name: `mark-goal-achieved-${selection}-radio`,
  properties: {
    'Selected Value': getSelectionValue(selection, noValue),
    ...(previousSelection &&
      previousSelection !== selection && {
        'Previous Value': getSelectionValue(previousSelection, noValue),
      }),
  },
})

export const createGoalAchievementRadioTelemetryTracker = (initialSelection?: GoalAchievementSelection) => {
  let previousSelection = initialSelection

  return (selection: GoalAchievementSelection, noValue: string): GoalAchievementRadioTelemetryEvent => {
    const event = buildGoalAchievementRadioTelemetryEvent(selection, noValue, previousSelection)
    previousSelection = selection
    return event
  }
}

export const buildGoalAchievementNoteTelemetryEvent = (noteAdded: boolean): GoalAchievementNoteTelemetryEvent => ({
  name: 'mark-goal-achieved-note',
  properties: {
    'Note Added': noteAdded,
  },
})
