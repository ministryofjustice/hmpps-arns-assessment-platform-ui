export const getDrugValueLower = () => async (value: any) => {
  if (value === '') {
    return ''
  }

  return value.toString().toLowerCase()
}
