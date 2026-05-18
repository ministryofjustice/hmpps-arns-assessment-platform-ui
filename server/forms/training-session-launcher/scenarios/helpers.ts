import { fakerEN_GB as faker } from '@faker-js/faker'
import { AccessMode, Location, YesNoNull } from '../../../interfaces/handover-api/shared'

/**
 * Generate a seed for reproducible randomization.
 * Uses current timestamp which provides sufficient uniqueness.
 */
export function generateSeed(): number {
  return Date.now()
}

/**
 * Generates a random CRN in the format X123456 (letter + 6 digits)
 */
export function randomCrn(): string {
  const letter = String.fromCharCode(65 + faker.number.int({ min: 0, max: 25 }))
  const digits = faker.number.int({ min: 100000, max: 999999 })

  return `${letter}${digits}`
}

/**
 * Generates a random PNC in the format YYYY/NNNNNNNL (year/7 digits + letter)
 */
export function randomPnc(): string {
  const year = faker.number.int({ min: 1990, max: new Date().getFullYear() })
  const digits = String(faker.number.int({ min: 1000000, max: 9999999 }))
  const letter = String.fromCharCode(65 + faker.number.int({ min: 0, max: 25 }))

  return `${year}/${digits}${letter}`
}

/**
 * Generates a random OASys Assessment PK (7-digit numeric string)
 */
export function randomOasysAssessmentPk(): string {
  return String(faker.number.int({ min: 1000000, max: 9999999 }))
}

/**
 * Generates a random date of birth for an adult (18-88 years old)
 * Returns in ISO format (YYYY-MM-DD)
 */
export function randomDateOfBirth(): string {
  const today = new Date()
  const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  const dob = faker.date.past({ years: 70, refDate: eighteenYearsAgo })

  return dob.toISOString().split('T')[0]
}

/**
 * Helper to generate random YES/NO value
 */
export function randomYesNo(): YesNoNull {
  return faker.helpers.arrayElement(['YES', 'NO'])
}

/**
 * Sanitize a name to only contain allowed characters for the handover API
 * Allowed: alphabetic characters, hyphens, spaces, apostrophes
 */
function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z\s\-']/g, '').substring(0, 50)
}

/**
 * Generate a safe practitioner display name
 * Uses faker but sanitizes the output to ensure API compatibility
 */
export function randomPractitionerName(): string {
  const firstName = sanitizeName(faker.person.firstName())
  const lastName = sanitizeName(faker.person.lastName())

  return `${firstName} ${lastName}`.substring(0, 50)
}

/**
 * Helper to generate random score as string, or undefined ~20% of the time
 */
export function randomScore(maxScore: number): () => string | undefined {
  return () => {
    if (faker.number.float({ min: 0, max: 1 }) < 0.2) {
      return undefined
    }

    return String(faker.number.int({ min: 0, max: maxScore }))
  }
}

/**
 * Random first name
 */
export function randomFirstName(): string {
  return faker.person.firstName()
}

/**
 * Random last name
 */
export function randomLastName(): string {
  return faker.person.lastName()
}

/**
 * Random gender code (NOMIS standard)
 */
export function randomGender(): string {
  return faker.helpers.arrayElement(['0', '1', '2', '9'])
}

/**
 * Random location
 */
export function randomLocation(): Location {
  return faker.helpers.arrayElement<Location>(['COMMUNITY', 'PRISON'])
}

/**
 * Random access mode
 */
export function randomAccessMode(): AccessMode {
  return faker.helpers.arrayElement<AccessMode>(['READ_ONLY', 'READ_WRITE'])
}

/**
 * Random plan access mode
 */
export function randomPlanAccessMode(): AccessMode {
  return faker.helpers.arrayElement<AccessMode>(['READ_ONLY', 'READ_WRITE'])
}

/**
 * Random practitioner identifier (TRAINING followed by 4 digits)
 */
export function randomPractitionerIdentifier(): string {
  return `TRAINING${String(faker.number.int({ min: 1, max: 9999 })).padStart(4, '0')}`
}
