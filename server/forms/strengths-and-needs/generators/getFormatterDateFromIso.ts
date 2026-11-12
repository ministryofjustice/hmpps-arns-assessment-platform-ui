import { formatDate } from '../../../utils/utils'

export const getFormatterDateFromIso = () => async (value: any) => {
  if (value === undefined || value === '') {
    return 'Not provided'
  }

  return formatDate(value, 'simple')
}
