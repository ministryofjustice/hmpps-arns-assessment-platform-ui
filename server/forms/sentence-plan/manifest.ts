import { AapPackageManifest } from '@ministryofjustice/hmpps-aap-sdk/AapPackageManifest'
import sentencePlanFormPackage from '.'

export default AapPackageManifest.create({
  resources: {
    templates: ['**/*.njk'],
    assets: {
      entryPoints: ['assets/form.js', 'assets/form.scss'],
    },
  },
  forge: {
    package: sentencePlanFormPackage,
    dependencies: services => ({
      api: services.assessmentPlatformApi,
      coordinatorApi: services.coordinatorApi,
      arnsApi: services.arnsApi,
      deliusApi: services.deliusApi,
      mpopComponents: services.mpopComponents,
      auditService: services.audit,
      featureFlagService: services.featureFlags,
      logger: services.logger,
      domainEventsService: services.domainEvents,
    }),
  },
  authentication: {
    // This page must remain reachable after expiry so it can explain that unsaved information was deleted.
    bypassPaths: ['/sentence-plan/unsaved-information-deleted'],
  },
})
