import { Request, type RequestHandler, type Response, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { Need, NewObjective } from '../data/sentencePlanClient'

export default function objectiveRoutes(router: Router, service: Services): Router {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  async function loadObjective(sentencePlanId: string, objectiveId?: string) {
    const sentencePlan = await service.sentencePlanClient.getSentencePlan(sentencePlanId)
    const [caseDetails, objective] = await Promise.all([
      service.deliusService.getCaseDetails(sentencePlan.crn),
      objectiveId ? service.sentencePlanClient.getObjective(sentencePlanId, objectiveId) : null,
    ])
    return { objective, caseDetails, sentencePlan }
  }

  async function loadNeeds(crn: string) {
    const needs = await service.oasysClient.getNeeds(crn)
    console.log(needs)
  }

  async function validateObjective(
    objective: NewObjective,
    sentencePlanId: string,
    req: Request,
    res: Response,
  ): Promise<boolean> {
    const errorMessages: ErrorMessages = {}
    if (objective.description.length === 0) {
      errorMessages.description = { text: 'Please write an objective' }
    }
    if (objective.description.trim().split(/\s+/).length > 50) {
      errorMessages.description = { text: 'Objective must be 50 words or less' }
    }
    if (req.body['relates-to-needs'] == null) {
      errorMessages.relatesToNeeds = { text: 'Select yes if this objective relates to a criminogenic need' }
    }
    if (req.body['relates-to-needs'] === 'yes' && (objective.needs == null || objective.needs.length === 0)) {
      errorMessages.needs = { text: 'Select at least one criminogenic need' }
    }
    if (req.body.motivation == null) {
      errorMessages.motivation = { text: 'Please select a motivation level' }
    }
    if (Object.keys(errorMessages).length > 0) {
      res.render('pages/sentencePlan/objective', { errorMessages, ...(await loadObjective(sentencePlanId)), objective })
      return false
    }
    return true
  }

  get('/sentence-plan/:sentencePlanId/add-objective', async (req, res) => {
    const { sentencePlanId } = req.params
    res.render('pages/sentencePlan/objective', await loadObjective(sentencePlanId))
  })

  post('/sentence-plan/:sentencePlanId/add-objective', async function addObjective(req, res) {
    const { sentencePlanId } = req.params
    const objective = {
      description: req.body.description,
      motivation: req.body.motivation,
      needs: req.body.needs?.map((code: string): Need => ({ code })) || [],
    }
    if (await validateObjective(objective, sentencePlanId, req, res)) {
      const { id } = await service.sentencePlanClient.createObjective(sentencePlanId, objective)
      res.redirect(`/sentence-plan/${sentencePlanId}/objective/${id}/add-action`)
    }
  })

  get('/sentence-plan/:sentencePlanId/objective/:objectiveId', async (req, res) => {
    const { sentencePlanId, objectiveId } = req.params
    res.render('pages/sentencePlan/objective', await loadObjective(sentencePlanId, objectiveId))
  })

  post('/sentence-plan/:sentencePlanId/objective/:objectiveId', async function updateObjective(req, res) {
    const { sentencePlanId, objectiveId } = req.params
    const objective = {
      description: req.body.description,
      motivation: req.body.motivation,
      needs: req.body.needs?.map((code: string): Need => ({ code })) || [],
    }
    if (await validateObjective(objective, sentencePlanId, req, res)) {
      await service.sentencePlanClient.updateObjective(sentencePlanId, objectiveId, objective)
      res.redirect(`/sentence-plan/${sentencePlanId}/summary`)
    }
  })

  interface ErrorMessages {
    [key: string]: { text: string }
  }

  return router
}
