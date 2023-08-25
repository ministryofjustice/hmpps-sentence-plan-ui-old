import { type RequestHandler, Router } from 'express'
import probationSearchRoutes from '@ministryofjustice/probation-search-frontend/routes/search'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import sentencePlanRoutes from './sentencePlan'
import objectiveRoutes from './objective'
import actionRoutes from './action'
import config from '../config'
import localData from '../data/probation-search-api'

export default function routes(service: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res) => res.render('pages/index'))
  probationSearchRoutes({ router, environment: config.env, localData, oauthClient: service.hmppsAuthClient })
  sentencePlanRoutes(router, service)
  objectiveRoutes(router, service)
  actionRoutes(router, service)

  return router
}
