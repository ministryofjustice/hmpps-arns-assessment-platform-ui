import { sanMigrations } from './registry'
import { formConfigsByVersion } from '../constants/formConfigRegistry'
import { latestVersion } from '../constants/formVersion'

const finalVersionFrom = (version: string): string => {
  const nextMigration = sanMigrations.find(migration => migration.from === version)

  return nextMigration ? finalVersionFrom(nextMigration.to) : version
}

describe('sanMigrations', () => {
  it('should reach the latest version when starting from any version with a form config', () => {
    // Arrange
    const versions = Object.keys(formConfigsByVersion)

    // Act
    const finalVersions = versions.map(finalVersionFrom)

    // Assert
    expect(finalVersions).toEqual(versions.map(() => latestVersion))
  })

  it('should have a form config for every version a migration moves between', () => {
    // Arrange
    const migrationVersions = sanMigrations.flatMap(migration => [migration.from, migration.to])

    // Act
    const unconfiguredVersions = migrationVersions.filter(version => !formConfigsByVersion[version])

    // Assert
    expect(unconfiguredVersions).toEqual([])
  })
})
