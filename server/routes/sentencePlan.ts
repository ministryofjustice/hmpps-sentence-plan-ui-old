import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import SentencePlanController from '../controller/sentencePlanController'

export default function sentencePlanRoutes(router: Router, service: Services): Router {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const sentencePlanController = new SentencePlanController(service.sentencePlanClient, service.deliusService)
  get('/case/:crn', sentencePlanController.loadCase)
  get('/case/:crn/create-sentence-plan', sentencePlanController.create)
  get('/sentence-plan/:id/summary', sentencePlanController.summary)

  return router
}
