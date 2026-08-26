import { formVersion } from './formVersion'
import { Section } from './section'

export const sectionPath = (section: (typeof Section)[keyof typeof Section]) =>
  `/tiering-assessment/${formVersion}${section.path}/`
