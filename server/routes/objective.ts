import { Request, type RequestHandler, type Response, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { Need, NewObjective } from '../data/sentencePlanClient'
import { Need as OasysNeed } from '../data/oasysClient'

export default function objectiveRoutes(router: Router, service: Services): Router {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  async function loadObjective(sentencePlanId: string, objectiveId?: string) {
    const sentencePlan = await service.sentencePlanClient.getSentencePlan(sentencePlanId)
    const [caseDetails, objective, oasysNeeds] = await Promise.all([
      service.deliusService.getCaseDetails(sentencePlan.crn),
      objectiveId ? service.sentencePlanClient.getObjective(sentencePlanId, objectiveId) : null,
      loadNeeds(sentencePlan.crn),
    ])
    const selectedNeeds = objective?.needs?.map(it => it.code) || []
    const selectedNeedsDescriptions = selectedNeeds.map(code => oasysNeeds.find(it => it.key === code).description)
    const needsOptions = oasysNeeds.map(it => ({
      value: it.key,
      text: it.description,
      checked: selectedNeeds.includes(it.key),
    }))
    return { objective, needsOptions, selectedNeeds, selectedNeedsDescriptions, caseDetails, sentencePlan }
  }

  async function loadNeeds(crn: string): Promise<OasysNeed[]> {
    const needs = await service.oasysClient.getNeeds(crn)
    return needs.criminogenicNeeds
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
    if (req.body.status == null) {
      errorMessages.status = { text: 'Please select the status of the objective' }
    }
    if (Object.keys(errorMessages).length > 0) {
      res.render('pages/sentencePlan/objective', { errorMessages, ...(await loadObjective(sentencePlanId)), objective })
      return false
    }
    return true
  }

  function getNeeds(req: Request): Need[] {
    if (req.body['relates-to-needs'] === 'yes' && req.body.needs) {
      return req.body.needs.map((code: string): Need => ({ code }))
    }
    return []
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
      status: req.body.status,
      needs: getNeeds(req),
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
      status: req.body.status,
      needs: getNeeds(req),
    }
    if (await validateObjective(objective, sentencePlanId, req, res)) {
      const existingObjective = await service.sentencePlanClient.getObjective(sentencePlanId, objectiveId)
      await service.sentencePlanClient.updateObjective({ ...existingObjective, ...objective })
      res.redirect(`/sentence-plan/${sentencePlanId}/objective/${objectiveId}/summary`)
    }
  })

  get('/sentence-plan/:sentencePlanId/objective/:objectiveId/summary', async (req, res) => {
    const { sentencePlanId, objectiveId } = req.params
    const { actions } = await service.sentencePlanClient.listActions(sentencePlanId, objectiveId)
    res.render('pages/sentencePlan/objectiveSummary', {
      actions,
      ...(await loadObjective(sentencePlanId, objectiveId)),
    })
  })

  post('/sentence-plan/:sentencePlanId/objective/:objectiveId/delete', async function deleteAction(req, res) {
    const { sentencePlanId, objectiveId } = req.params
    await service.sentencePlanClient.deleteObjective(sentencePlanId, objectiveId)
    res.redirect(`/sentence-plan/${sentencePlanId}/summary`)
  })

  get('/sentence-plan/:sentencePlanId/objective/:objectiveId/confirmDelete', async function deleteAction(req, res) {
    const { sentencePlanId, objectiveId } = req.params
    res.render('pages/sentencePlan/confirmDeleteObjective', {
      ...(await loadObjective(sentencePlanId, objectiveId)),
    })
  })

  interface ErrorMessages {
    [key: string]: { text: string }
  }

  return router
}
