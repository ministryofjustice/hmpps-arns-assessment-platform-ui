/**
 * Rule for obfuscating a span attribute.
 */
export interface ObfuscationRule {
  /** The span attribute to target */
  attribute: string

  /** Regex pattern to match. If omitted, the entire attribute value is hashed. */
  pattern?: RegExp
}

/**
 * Configuration for the span obfuscator.
 */
export interface ObfuscatorConfig {
  /** Secret key used for hashing. Same key = same hash for correlation. */
  key: string

  /** Rules defining what to obfuscate */
  rules: ObfuscationRule[]
}
