# AAP SDK

The published journey-facing contract for the ARNS Assessment Platform. Install it as
`@ministryofjustice/hmpps-aap-sdk` and import the concrete module you need.

A journey imports Forge, `@ministryofjustice/hmpps-aap-sdk/*`, its own files, and any third-party dependencies it owns.
It does not import platform internals or another journey. ESLint enforces that boundary.

## Declare an AAP package

Point the journey package metadata at its manifest:

```json
{
  "name": "@ministryofjustice/hmpps-aap-my-journey",
  "aap": {
    "manifest": "journey/manifest.ts"
  }
}
```

Use a root `.npmignore` to exclude tests and repository tooling from the source package.
Then declare the journey from that manifest:

```ts
import { AapPackageManifest } from '@ministryofjustice/hmpps-aap-sdk/AapPackageManifest'
import myFormPackage from '.'

export default AapPackageManifest.create({
  resources: {
    templates: ['**/*.njk'],
    assets: {
      entryPoints: ['assets/form.js', 'assets/form.scss'],
      staticFiles: ['assets/images/**/*'],
    },
  },
  forge: {
    package: myFormPackage,
    dependencies: services => ({ api: services.assessmentPlatformApi }),
  },
  authentication: {
    bypassPaths: ['/my-journey/public-page'],
  },
})
```

Resource paths are relative to `manifest.ts`. The platform calls `getResources()` during the build
to compile asset entry points and copy templates and static files into the package namespace. It
does not create runtime services or register the Forge package during that phase.

`forge.dependencies` receives the public capabilities defined by `JourneyServices`; concrete platform
clients and the platform's internal `Services` container are not part of the SDK.

Capability definitions live under `dependencies`, grouped by domain. For example, effects import
`@ministryofjustice/hmpps-aap-sdk/dependencies/audit/Audit.type` or
`@ministryofjustice/hmpps-aap-sdk/dependencies/coordinator/CoordinatorApi.type` directly. `JourneyServices.type` is only
the catalogue that gives manifests their capability names.

Reusable remote API clients live beside those domain contracts. The clients contain the HTTP
behaviour, request authentication mode and response/error handling, but they do not import
platform configuration, logging or infrastructure. The platform composition root constructs them
with an API config, authentication client and logger. The assessment client additionally accepts
the SDK's narrow `AssessmentCache` contract, which the platform implements with Redis.

Journeys receive the capability interfaces exposed by `JourneyServices`; they do not receive the
platform service container or need to construct API clients themselves. Keeping implementations in
the SDK makes the client behaviour part of the versioned package contract while leaving credentials,
environment configuration and lifecycle wiring with the platform.

Implementations that are adapters around platform infrastructure remain in the platform. This
currently includes HMPPS audit, SNS domain events, Flipt feature flags and Redis-backed preferences.
Their narrow interfaces still live in the SDK, so they can move later if they acquire a genuinely
reusable implementation rather than platform-specific wiring.

Journey-specific configuration belongs in the journey. Read its environment variables from a
local `config.ts` rather than importing `server/config.ts`.

## Local development

Install the build tools with `npm ci` at the platform root first. The SDK uses Rollup to
produce CommonJS and ESM modules with matching TypeScript declarations in `dist/`.
Existing subpath imports work in both formats; runtime dependencies stay external.

Build and register this checkout as the local package:

```shell
cd packages/aap-sdk
npm run build
npm link
```

Then link it into a journey repository:

```shell
npm link @ministryofjustice/hmpps-aap-sdk
```

From the platform root, use `npm pack ./packages/aap-sdk --ignore-scripts=false` when testing
the exact files that would be published. The flag enables the SDK's prepack build despite the
platform's default of disabling npm lifecycle scripts.
The journey repository owns its linting, typechecking and unit tests; the platform image is needed
only when running the journey inside the complete application for development or E2E testing.

Assembly discovers `aap.manifest` in installed and npm-linked packages and evaluates those manifests
in memory. An external journey author does not edit platform application source to register a
package or declare its build resources. Journey packages ship their TypeScript source; the platform
assembly compiles it, so they do not need their own compiled output.

## Contents

- `AapPackageManifest` - package resources, Forge registration and platform integration metadata.
- `JourneyServices.type` - the capability catalogue used by manifests.
- `dependencies/` - injected capabilities, API contracts and reusable remote clients, grouped by
  domain.
- `components/` - reusable Forge UI such as the privacy screen.
- `types/` - shared contracts that are not themselves injectable capabilities.
- `utils/` - reusable effects and environment-specific helpers, including navigation, browser
  telemetry and PDF rendering constants.
