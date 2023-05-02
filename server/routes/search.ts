import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import SearchController from '../controller/searchController'

export default function searchRoutes(router: Router, service: Services): Router {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const searchController = new SearchController(service.probationSearchClient)
  post('/search', searchController.submitQuery)
  get('/search', searchController.loadResults)

  return router
}
