import { formVersion } from './formVersion'
import { Step } from './page'

export const sectionPath = (section: (typeof Step)[keyof typeof Step]) =>
  `/tiering-assessment/${formVersion}${section.path}/`
