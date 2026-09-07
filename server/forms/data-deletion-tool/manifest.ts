import { AapPackageManifest } from '@ministryofjustice/hmpps-aap-sdk/AapPackageManifest'
import dataDeletionToolFormPackage from '.'

export default AapPackageManifest.create({
  resources: {
    templates: ['**/*.njk'],
    assets: {
      entryPoints: ['assets/form.js', 'assets/form.scss'],
    },
  },
  forge: {
    package: dataDeletionToolFormPackage,
    dependencies: services => ({
      assessmentPlatformApiFactory: services.assessmentPlatformApiFactory,
    }),
  },
  authentication: {
    bypassPaths: ['/data-deletion-tool'],
  },
})
