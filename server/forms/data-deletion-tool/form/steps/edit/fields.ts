import { Edit } from '../../../components/edit/edit';
import { Data } from '@ministryofjustice/hmpps-forge/core/authoring';

export const editComponent = Edit({
  currentData: Data('currentData')
})
