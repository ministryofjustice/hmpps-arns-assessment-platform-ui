import { AapPackageManifest } from '@ministryofjustice/hmpps-aap-sdk/AapPackageManifest'
import platformPoliciesFormPackage from '.'

export default AapPackageManifest.create({
  resources: {
    templates: ['**/*.njk'],
  },
  forge: {
    package: platformPoliciesFormPackage,
    dependencies: () => ({}),
  },
  authentication: {
    bypassPaths: ['/platform'],
  },
})
