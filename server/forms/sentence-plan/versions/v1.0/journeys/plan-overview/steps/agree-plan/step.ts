import {
  next,
  step,
  submitTransition,
  Post,
  accessTransition,
  Data,
  Item,
  and,
  loadTransition,
  when,
  Query,
  Format,
} from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { Transformer } from '@form-engine/registry/transformers'
import { planAgreementQuestion, notesField, saveButton } from './fields'
import { SentencePlanEffects } from '../../../../../../effects'

export const agreePlanStep = step({
  path: '/agree-plan',
  title: 'Agree Plan',
  blocks: [planAgreementQuestion, notesField, saveButton],
  view: {
    locals: {
      backlink: when(Query('type').match(Condition.IsRequired()))
        .then(Format('overview?type=%1', Query('type')))
        .else('overview?type=current'),
    },
  },
  onLoad: [
    loadTransition({
      effects: [
        SentencePlanEffects.deriveGoalsWithStepsFromAssessment(),
        SentencePlanEffects.derivePlanAgreementsFromAssessment(),
      ],
    }),
  ],
  onAccess: [
    // Check if there are no active goals at all
    accessTransition({
      guards: Data('goals')
        .each(Iterator.Filter(Item().path('status').match(Condition.Equals('ACTIVE'))))
        .pipe(Transformer.Array.Length())
        .match(Condition.Equals(0)),
      redirect: [next({ goto: 'overview?type=current&error=no-active-goals' })],
    }),
    // Check if there are any active goals without steps
    accessTransition({
      guards: Data('goals')
        .each(
          Iterator.Filter(
            and(
              Item().path('status').match(Condition.Equals('ACTIVE')),
              Item().path('steps').pipe(Transformer.Array.Length()).match(Condition.Equals(0)),
            ),
          ),
        )
        .pipe(Transformer.Array.Length())
        .match(Condition.Number.GreaterThan(0)),
      redirect: [next({ goto: 'overview?type=current&error=no-steps' })],
    }),
  ],
  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [SentencePlanEffects.updatePlanAgreementStatus()],
        next: [next({ goto: 'overview' })],
      },
    }),
  ],
})
