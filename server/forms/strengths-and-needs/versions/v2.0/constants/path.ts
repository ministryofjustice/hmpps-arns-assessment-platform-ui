import { Params } from '@ministryofjustice/hmpps-forge/core/authoring'
import { basePath } from './formVersion'

// TODO: refactor how this is managed in sentence plan and export from there instead
export const sentencePlanViewHistoricBasePath = 'sentence-plan/v1.0/plan/view-historic/'

export const baseSanRoute = [basePath, Params('mode'), Params('uuid')]
