import { AapPackageManifest } from '@ministryofjustice/hmpps-aap-sdk/AapPackageManifest'
import trainingSessionLauncherFormPackage from '.'

export default AapPackageManifest.create({
  resources: {
    templates: ['**/*.njk'],
    assets: {
      entryPoints: ['assets/form.js', 'assets/form.scss'],
    },
  },
  forge: {
    package: trainingSessionLauncherFormPackage,
    dependencies: services => ({
      coordinatorApiClient: services.coordinatorApi,
      handoverApiClient: services.handoverApi,
      logger: services.logger,
      preferencesStore: services.preferences,
    }),
  },
  authentication: {
    bypassPaths: ['/training-session-launcher'],
  },
})
