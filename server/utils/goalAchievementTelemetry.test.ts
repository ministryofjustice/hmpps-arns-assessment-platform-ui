import {
  buildGoalAchievementNoteTelemetryEvent,
  createGoalAchievementRadioTelemetryTracker,
} from './goalAchievementTelemetry'

describe('goal achievement telemetry', () => {
  it('does not include a previous value for the first selection', () => {
    const buildRadioEvent = createGoalAchievementRadioTelemetryTracker()

    expect(buildRadioEvent('yes')).toEqual({
      name: 'mark-goal-achieved-yes-radio',
      properties: {
        'Selected Value': 'Yes, mark it as achieved',
      },
    })
  })

  it('includes the previous value after the selection changes', () => {
    const buildRadioEvent = createGoalAchievementRadioTelemetryTracker()

    buildRadioEvent('yes')

    expect(buildRadioEvent('no')).toEqual({
      name: 'mark-goal-achieved-no-radio',
      properties: {
        'Selected Value': 'No, go to plan',
        'Previous Value': 'Yes, mark it as achieved',
      },
    })
  })

  it('tracks each selection change in sequence', () => {
    const buildRadioEvent = createGoalAchievementRadioTelemetryTracker()

    buildRadioEvent('no')
    buildRadioEvent('yes')

    expect(buildRadioEvent('no').properties).toEqual({
      'Selected Value': 'No, go to plan',
      'Previous Value': 'Yes, mark it as achieved',
    })
  })

  it('uses a non-personal value for the No option', () => {
    const buildRadioEvent = createGoalAchievementRadioTelemetryTracker()

    const event = buildRadioEvent('no')

    expect(event.properties['Selected Value']).toBe('No, go to plan')
    expect(JSON.stringify(event)).not.toContain('Pip')
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
