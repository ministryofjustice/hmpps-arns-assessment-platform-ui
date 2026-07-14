import {
  buildGoalAchievementNoteTelemetryEvent,
  createGoalAchievementRadioTelemetryTracker,
} from './goalAchievementTelemetry'

describe('goal achievement telemetry', () => {
  const noValue = "No, go to Pip's plan"

  it('does not include a previous value for the first selection', () => {
    const buildRadioEvent = createGoalAchievementRadioTelemetryTracker()

    expect(buildRadioEvent('yes', noValue)).toEqual({
      name: 'mark-goal-achieved-yes-radio',
      properties: {
        'Selected Value': 'Yes, mark as achieved',
      },
    })
  })

  it('includes the previous value after the selection changes', () => {
    const buildRadioEvent = createGoalAchievementRadioTelemetryTracker()

    buildRadioEvent('yes', noValue)

    expect(buildRadioEvent('no', noValue)).toEqual({
      name: 'mark-goal-achieved-no-radio',
      properties: {
        'Selected Value': noValue,
        'Previous Value': 'Yes, mark as achieved',
      },
    })
  })

  it('tracks each selection change in sequence', () => {
    const buildRadioEvent = createGoalAchievementRadioTelemetryTracker()

    buildRadioEvent('no', noValue)
    buildRadioEvent('yes', noValue)

    expect(buildRadioEvent('no', noValue).properties).toEqual({
      'Selected Value': noValue,
      'Previous Value': 'Yes, mark as achieved',
    })
  })

  it.each([true, false])('builds the note event without including note content', noteAdded => {
    expect(buildGoalAchievementNoteTelemetryEvent(noteAdded)).toEqual({
      name: 'mark-goal-achieved-note',
      properties: {
        'Note Added': noteAdded,
      },
    })
  })
})
