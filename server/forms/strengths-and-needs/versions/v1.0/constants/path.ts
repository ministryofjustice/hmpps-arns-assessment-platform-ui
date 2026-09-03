import { Params } from '@ministryofjustice/hmpps-forge/core/authoring'
import { basePath } from './formVersion'

export const baseSanRoute = [basePath, Params('mode'), Params('uuid')]
