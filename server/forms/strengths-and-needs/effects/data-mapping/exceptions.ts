/** Port of oasys/datamapping/exception/*.kt and service/exception/FormVersionNotFoundException.kt. */

export class InvalidMappingException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidMappingException'
  }
}

export class MappingNotFoundException extends Error {
  constructor(version: string) {
    super(`No data mapping found for form version ${version}`)
    this.name = 'MappingNotFoundException'
  }
}

export class FormVersionNotFoundException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FormVersionNotFoundException'
  }
}
