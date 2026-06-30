export function assertNumber(value: unknown, functionName: string): asserts value is number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new TypeError(`${functionName} expected a number`)
  }
}
