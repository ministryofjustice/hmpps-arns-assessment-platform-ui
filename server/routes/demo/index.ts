import { Router } from 'express'
import type { Services } from '../../services'
import assessment from './assessment'
import sentencePlan from './sentencePlan'

export default function routes(services: Services): Router {
  const router = Router()

  Array.of(assessment(services), sentencePlan(services)).forEach(it => router.use(it))

  return router
}
