import type { Forge, ForgePackageRegistration } from '@ministryofjustice/hmpps-forge/core'
import type { JourneyServices } from './JourneyServices.type'

export interface AapPackageAssets {
  /** JavaScript and stylesheet entry points compiled by the platform. */
  entryPoints?: string[]
  /** Files copied unchanged into the package's public asset namespace. */
  staticFiles?: string[]
}

export interface AapPackageResources {
  /** Nunjucks templates copied while preserving their package-relative paths. */
  templates?: string[]
  assets?: AapPackageAssets
}

export interface AapPackageManifestDefinition<TDeps> {
  /** Source resources owned by the package, relative to its manifest. */
  resources?: AapPackageResources
  forge: {
    package: ForgePackageRegistration<TDeps>
    dependencies: (services: JourneyServices) => TDeps
  }
  authentication?: {
    /** Path prefixes reachable without authentication. */
    bypassPaths?: string[]
  }
}

/** Declares everything the platform needs to assemble and register an AAP package. */
export class AapPackageManifest {
  private constructor(
    private readonly journeyCode: string,
    private readonly resources: AapPackageResources,
    private readonly authBypassPaths: string[],
    private readonly registerPackage: (forge: Forge, services: JourneyServices) => Forge,
  ) {}

  static create<TDeps>(definition: AapPackageManifestDefinition<TDeps>): AapPackageManifest {
    return new AapPackageManifest(
      definition.forge.package.journey.code,
      definition.resources ?? {},
      definition.authentication?.bypassPaths ?? [],
      (forge, services) => forge.registerPackage(definition.forge.package, definition.forge.dependencies(services)),
    )
  }

  getJourneyCode(): string {
    return this.journeyCode
  }

  getResources(): AapPackageResources {
    return this.resources
  }

  registerWith(forge: Forge, services: JourneyServices): Forge {
    return this.registerPackage(forge, services)
  }

  getAuthBypassPaths(): string[] {
    return this.authBypassPaths
  }
}
