import {
  access,
  Answer,
  Format,
  Query,
  redirect,
  step,
  submit,
  when,
  Condition,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { pageHeading, areaOfNeedField, continueButton } from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../../effects'

/**
 * Entry point for creating a goal: the practitioner picks an area of need
 * before being taken to the add-goal page for that area. No option is
 * pre-selected, so Accommodation is no longer the accidental default.
 */
export const selectAreaOfNeedStep = step({
  path: '/select-area-of-need',
  title: 'Create a goal',
  reachability: { entryWhen: true },
  view: {
    locals: {
      /*
       * Back link. If the user came from "Change area of need" (change=true), go back to that
       * goal-details page. Otherwise go to the plan overview, keeping the plan tab.
       */
      backlink: when(Query('change').match(Condition.IsRequired()))
        .then(
          when(Query('goalStatusTab').match(Condition.IsRequired()))
            .then(Format('add-goal/%1?goalStatusTab=%2', Query('area'), Query('goalStatusTab')))
            .else(Format('add-goal/%1', Query('area'))),
        )
        .else(
          when(Query('goalStatusTab').match(Condition.IsRequired()))
            .then(Format('../../plan/overview?goalStatusTab=%1', Query('goalStatusTab')))
            .else('../../plan/overview'),
        ),
    },
  },
  blocks: [pageHeading, areaOfNeedField, continueButton],
  onAccess: [
    access({
      effects: [SentencePlanEffects.sendAuditEvent(AuditEvent.VIEW_SELECT_AREA_OF_NEED)],
    }),
  ],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        next: [
          // Carry the originating plan tab through to add-goal so its back link can return there.
          redirect({
            when: Query('goalStatusTab').match(Condition.IsRequired()),
            goto: Format('add-goal/%1?goalStatusTab=%2', Answer('area_of_need'), Query('goalStatusTab')),
          }),
          redirect({ goto: Format('add-goal/%1', Answer('area_of_need')) }),
        ],
      },
    }),
  ],
})
