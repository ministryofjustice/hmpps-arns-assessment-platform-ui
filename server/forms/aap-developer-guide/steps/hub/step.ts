import { step } from '@form-engine/form/builders'
import { welcomeIntro, conceptCards } from './fields'

/**
 * Hub Step: Developer Guide Home
 *
 * Central navigation point for the AAP Developer Guide.
 * Lists all concept modules with descriptions and links using MOJ Card components.
 *
 * Pattern: This is the "hub" in a hub-and-spoke navigation pattern.
 * Each card links to a sub-journey covering that topic.
 */
export const hubStep = step({
  path: '/hub',
  title: 'Developer Guide Home',
  isEntryPoint: true,
  blocks: [welcomeIntro, conceptCards],
})
