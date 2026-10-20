export const migrationPath = '/strengths-and-needs/migration'

/**
 * An assessment's answers and properties as plain values, which is what a
 * migration reads and returns.
 */
export interface AssessmentSnapshot {
  answers: Record<string, unknown>
  properties: Record<string, unknown>
}

export type MigrationInputs = Record<string, unknown>

/**
 * Moves an assessment from one SAN form version to the next. Each migration
 * has its own page at `${migrationPath}/${codeOf(migration)}`, which runs it,
 * saves the result and goes back to the migration index for the next one.
 *
 * `inputs` holds the practitioner's answers from that page, and is empty for a
 * migration whose page asks nothing.
 */
export interface SanMigration {
  from: string
  to: string
  migrate(snapshot: AssessmentSnapshot, inputs: MigrationInputs): AssessmentSnapshot
}

/** Names a migration in URLs, e.g. `v1.0-to-v2.0`. */
export const codeOf = (migration: SanMigration): string => `${migration.from}-to-${migration.to}`
