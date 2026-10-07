export const IsValidJson = (_deps: any) => (value: unknown) => {
  if (typeof value !== 'string') {
    throw new TypeError('IsValidJson expects a string')
  }

  try {
    JSON.parse(value)
    return true
  } catch {
    return false
  }
}
