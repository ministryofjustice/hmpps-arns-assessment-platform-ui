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
      // Preserve the originating plan tab so backing out returns there. Current is the
      // default tab, so it is never threaded as a query param.
      backlink: when(Query('type').match(Condition.IsRequired()))
        .then(Format('../../plan/overview?type=%1', Query('type')))
        .else('../../plan/overview'),
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
            when: Query('type').match(Condition.IsRequired()),
            goto: Format('add-goal/%1?type=%2', Answer('area_of_need'), Query('type')),
          }),
          redirect({ goto: Format('add-goal/%1', Answer('area_of_need')) }),
        ],
      },
    }),
  ],
})
