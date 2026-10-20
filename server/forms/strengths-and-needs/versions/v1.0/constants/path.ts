import { Params } from '@ministryofjustice/hmpps-forge/core/authoring'
import { formRootPath } from './formVersion'

// TODO: refactor how this is managed in sentence plan and export from there instead
export const sentencePlanViewHistoricBasePath = 'sentence-plan/v1.0/plan/view-historic/'

// The version comes from the URL, so these screens can serve every form version that shares them
export const baseSanRoute = [formRootPath, Params('formVersion'), Params('mode'), Params('uuid')]
