import {
  accessTransition,
  Answer,
  block,
  Data,
  journey,
  loadTransition,
  next,
  Post,
  step,
  submitTransition,
} from '@form-engine/form/builders'
import { GovUKButton } from '@form-engine/registry/components/govuk-frontend/button/govukButton'
import { Condition } from '@form-engine/registry/conditions'
import { or } from '@form-engine/form/builders/PredicateTestExprBuilder'
import { StrengthsAndNeedsEffect } from '../../../effects'
import * as accommodationType from './fields/accommodationType'
import * as livingWith from './fields/livingWith'
import * as suitableLocation from './fields/suitableLocation'
import * as suitableAccommodation from './fields/suitableAccommodation'
import * as suitableHousingPlanned from './fields/suitableHousingPlanned'
import * as noAccommodation from './fields/noAccommodation'
import * as wantToMakeChanges from './fields/wantToMakeChanges'

const URL = {
  currentAccommodation: '/current-accommodation',
  settledAccommodation: '/settled-accommodation',
  temporaryAccommodation: '/temporary-accommodation',
  temporaryAccommodationCasAp: '/temporary-accommodation-cas-ap',
  noAccommodation: '/no-accommodation',
  summary: '/accommodation-summary',
  analysis: '/accommodation-analysis',
}

const accommodationTypeGroup = [
  accommodationType.currentAccommodation,
  accommodationType.typeOfSettledAccommodation,
  accommodationType.typeOfTemporaryAccommodation,
  accommodationType.shortTermAccommodationEndDate,
  accommodationType.approvedPremisesEndDate,
  accommodationType.cas2EndDate,
  accommodationType.cas3EndDate,
  accommodationType.immigrationAccommodationEndDate,
  accommodationType.typeOfNoAccommodation,
]

const livingWithGroup = [livingWith.livingWith]

const suitableLocationGroup = [
  suitableLocation.suitableHousingLocation,
  suitableLocation.suitableHousingLocationConcerns,
]

const suitableAccommodationGroup = [
  suitableAccommodation.suitableHousing,
  suitableAccommodation.suitableHousingConcerns,
  suitableAccommodation.unsuitableHousingConcerns,
]

const suitableHousingPlannedGroup = [
  suitableHousingPlanned.suitableHousingPlanned,
  suitableHousingPlanned.futureAccommodationType,
]

const noAccommodationGroup = [noAccommodation.noAccommodationReason, noAccommodation.pastAccommodationDetails]

// TODO: This could actually just be built into the template.
const continueButton = block<GovUKButton>({
  variant: 'govukButton',
  name: 'action',
  value: 'continue',
})

export default journey({
  code: 'strength-and-needs-accommodation',
  title: 'Accommodation',
  path: '/accommodation',

  onLoad: [
    loadTransition({
      effects: [StrengthsAndNeedsEffect.LoadAssessment(Data('crn'))],
    }),
  ],

  // TODO: Just an example, remove this later unless i can think of a good one
  onAccess: [
    accessTransition({
      guards: Data('user.role').match(Condition.Equals(['READ_WRITE'])),
      redirect: [next({ goto: '/unauthorized' })],
    }),
  ],

  steps: [
    // Step 1: Current Accommodation
    step({
      path: URL.currentAccommodation,
      blocks: [...accommodationTypeGroup, continueButton],
      onSubmission: [
        submitTransition({
          when: Post('action').match(Condition.Equals('continue')),
          validate: true,
          onValid: {
            effects: [StrengthsAndNeedsEffect.Save()],
            next: [
              // Navigate to settled accommodation
              next({
                when: Answer('current_accommodation').match(Condition.Equals('SETTLED')),
                goto: URL.settledAccommodation,
              }),
              // Navigate to temporary accommodation (short term or immigration)
              next({
                when: or(
                  Answer('type_of_temporary_accommodation').match(Condition.Equals('SHORT_TERM')),
                  Answer('type_of_temporary_accommodation').match(Condition.Equals('IMMIGRATION')),
                ),
                goto: URL.temporaryAccommodation,
              }),
              // Navigate to temporary accommodation CAS/AP (all other temporary types)
              next({
                when: Answer('current_accommodation').match(Condition.Equals('TEMPORARY')),
                goto: URL.temporaryAccommodationCasAp,
              }),
              // Navigate to no accommodation
              next({
                when: Answer('current_accommodation').match(Condition.Equals('NO_ACCOMMODATION')),
                goto: URL.noAccommodation,
              }),
            ],
          },
          onInvalid: {
            effects: [StrengthsAndNeedsEffect.Save()],
            next: [next({ goto: URL.currentAccommodation })],
          },
        }),
      ],
    }),

    // Step 2: Settled Accommodation
    step({
      path: URL.settledAccommodation,
      blocks: [
        ...livingWithGroup,
        ...suitableLocationGroup,
        ...suitableAccommodationGroup,
        wantToMakeChanges.wantToMakeChanges,
        continueButton,
      ],
      onSubmission: [
        submitTransition({
          when: Post('action').match(Condition.Equals('continue')),
          validate: true,
          onValid: {
            effects: [StrengthsAndNeedsEffect.Save()],
            next: [next({ goto: URL.summary })],
          },
          onInvalid: {
            effects: [StrengthsAndNeedsEffect.SaveDraft()],
            next: [next({ goto: URL.settledAccommodation })],
          },
        }),
      ],
    }),

    // Step 3: Temporary Accommodation (Short term & Immigration)
    step({
      path: URL.temporaryAccommodation,
      blocks: [
        ...livingWithGroup,
        ...suitableLocationGroup,
        ...suitableAccommodationGroup,
        ...suitableHousingPlannedGroup,
        wantToMakeChanges.wantToMakeChanges,
        continueButton,
      ],

      onSubmission: [
        submitTransition({
          when: Post('action').match(Condition.Equals('continue')),
          validate: true,
          onValid: {
            effects: [StrengthsAndNeedsEffect.Save()],
            next: [next({ goto: URL.summary })],
          },
          onInvalid: {
            effects: [StrengthsAndNeedsEffect.SaveDraft()],
            next: [next({ goto: URL.temporaryAccommodation })],
          },
        }),
      ],
    }),

    // Step 4: Temporary Accommodation CAS/AP
    step({
      path: URL.temporaryAccommodationCasAp,
      blocks: [
        ...suitableLocationGroup,
        ...suitableAccommodationGroup,
        ...suitableHousingPlannedGroup,
        wantToMakeChanges.wantToMakeChanges,
        continueButton,
      ],
      onSubmission: [
        submitTransition({
          when: Post('action').match(Condition.Equals('continue')),
          validate: true,
          onValid: {
            effects: [StrengthsAndNeedsEffect.Save()],
            next: [next({ goto: URL.summary })],
          },
          onInvalid: {
            effects: [StrengthsAndNeedsEffect.SaveDraft()],
            next: [next({ goto: URL.temporaryAccommodationCasAp })],
          },
        }),
      ],
    }),

    // Step 5: No Accommodation
    step({
      path: URL.noAccommodation,
      blocks: [
        ...noAccommodationGroup,
        ...suitableHousingPlannedGroup,
        wantToMakeChanges.wantToMakeChanges,
        continueButton,
      ],
      onSubmission: [
        submitTransition({
          when: Post('action').match(Condition.Equals('continue')),
          validate: true,
          onValid: {
            effects: [StrengthsAndNeedsEffect.Save()],
            next: [next({ goto: URL.summary })],
          },
          onInvalid: {
            effects: [StrengthsAndNeedsEffect.SaveDraft()],
            next: [next({ goto: URL.noAccommodation })],
          },
        }),
      ],
    }),

    // Step 6: Summary
    step({
      path: URL.summary,
      blocks: [
        // TODO: Add practitionerAnalysis fields
        // TODO: Add summary block/component to display all collected data
        continueButton,
      ],
      onSubmission: [
        submitTransition({
          when: Post('action').match(Condition.Equals('continue')),
          validate: true,
          onValid: {
            effects: [StrengthsAndNeedsEffect.Save(), StrengthsAndNeedsEffect.CompleteSection('accommodation')],
            next: [next({ goto: `${URL.analysis}#practitioner-analysis` })],
          },
          onInvalid: {
            next: [next({ goto: URL.summary })],
          },
        }),
      ],
    }),

    // Step 7: Analysis (View-only)
    step({
      path: URL.analysis,
      blocks: [
        // TODO: Add read-only view of completed analysis
        // TODO: Use custom templates for analysis again? Or build a new component?
      ],
    }),
  ],
})
