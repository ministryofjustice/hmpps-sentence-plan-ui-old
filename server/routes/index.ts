import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import searchRoutes from './search'
import sentencePlanRoutes from './sentencePlan'
import objectiveRoutes from './objective'
import actionRoutes from './action'

export default function routes(service: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res) => res.render('pages/index'))
  searchRoutes(router, service)
  sentencePlanRoutes(router, service)
  objectiveRoutes(router, service)
  actionRoutes(router, service)

  return router
}
