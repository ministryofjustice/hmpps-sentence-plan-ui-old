import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import SearchController from '../controller/searchController'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(service: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  // Start page
  get('/', (req, res, next) => res.render('pages/index'))

  // Search
  const searchController = new SearchController(service.probationSearchClient)
  post('/search', searchController.submitQuery)
  get('/search', searchController.loadResults)

  // Sentence plans
  get('/sentence-plans/:crn', (req, res, next) => res.render('pages/sentencePlans'))
  get('/sentence-plans/:crn/create', (req, res, next) => res.render('pages/createSentencePlan'))

  return router
}
