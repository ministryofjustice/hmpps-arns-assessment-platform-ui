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

const selectionValues: Record<GoalAchievementSelection, string> = {
  yes: 'Yes, mark it as achieved',
  no: 'No, go to plan',
}

const getSelectionValue = (selection: GoalAchievementSelection): string => selectionValues[selection]

const buildGoalAchievementRadioTelemetryEvent = (
  selection: GoalAchievementSelection,
  previousSelection?: GoalAchievementSelection,
): GoalAchievementRadioTelemetryEvent => ({
  name: `mark-goal-achieved-${selection}-radio`,
  properties: {
    'Selected Value': getSelectionValue(selection),
    ...(previousSelection &&
      previousSelection !== selection && {
        'Previous Value': getSelectionValue(previousSelection),
      }),
  },
})

export const createGoalAchievementRadioTelemetryTracker = (initialSelection?: GoalAchievementSelection) => {
  let previousSelection = initialSelection

  return (selection: GoalAchievementSelection): GoalAchievementRadioTelemetryEvent => {
    const event = buildGoalAchievementRadioTelemetryEvent(selection, previousSelection)
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
