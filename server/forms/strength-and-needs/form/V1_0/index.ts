import { journey } from '@form-engine/form/builders'
import accommodation from './accommodation'

// TODO: This is where the `main` journey is, which is pretty much just the form parent.
export const StrengthsAndNeedsAssessment = journey({
  code: 'strengths-and-needs',
  title: 'Strengths and Needs Assessment',
  path: '/strength-and-needs',
  version: '1.0',
  children: [
    accommodation,
    /** TODO: more here eventually */
  ],
})
