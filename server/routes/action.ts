import { Request, type RequestHandler, type Response, Router } from 'express'
import { endOfMonth, isPast, isValid, parseISO } from 'date-fns'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { NewAction } from '../data/sentencePlanClient'

export default function actionRoutes(router: Router, service: Services): Router {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  async function loadAction(sentencePlanId: string, objectiveId: string, actionId?: string) {
    const sentencePlan = await service.sentencePlanClient.getSentencePlan(sentencePlanId)
    const [caseDetails, objective, action, nationalInterventions] = await Promise.all([
      service.deliusService.getCaseDetails(sentencePlan.crn),
      service.sentencePlanClient.getObjective(sentencePlanId, objectiveId),
      actionId ? service.sentencePlanClient.getAction(sentencePlanId, objectiveId, actionId) : null,
      service.interventionsClient.getNationalInterventionNames(),
    ])
    return { caseDetails, sentencePlan, objective, action, nationalInterventions }
  }

  async function validateAction(
    action: NewAction,
    sentencePlanId: string,
    objectiveId: string,
    req: Request,
    res: Response,
  ): Promise<boolean> {
    const errorMessages: ErrorMessages = {}
    if (req.body.description == null || req.body.description.length === 0) {
      errorMessages.description = { text: 'Please write an action' }
    }
    if (req.body.description != null && req.body.description.trim().split(/\s+/).length > 50) {
      errorMessages.description = { text: 'Action must be 50 words or less' }
    }
    if (req.body['relates-to-intervention'] == null) {
      errorMessages.relatesToIntervention = { text: 'Select yes if this action involves an intervention programme' }
    }
    if (action.interventionParticipation) {
      if (action.interventionType == null || action.interventionType.length === 0) {
        errorMessages.interventionType = { text: 'Select a type of intervention' }
      } else if (action.interventionName == null || action.interventionName.length === 0) {
        if (action.interventionType === 'accredited-programme') {
          errorMessages.apInterventionName = { text: 'Enter the name of the accredited programme' }
        } else if (action.interventionType === 'local') {
          errorMessages.localInterventionName = { text: 'Enter the name of the local intervention' }
        } else if (action.interventionType === 'national') {
          errorMessages.nationalInterventionName = { text: 'Enter the name of the national intervention' }
        } else if (action.interventionType === 'other') {
          errorMessages.otherInterventionName = { text: 'Enter the name of the intervention' }
        }
      }
    }

    if (req.body.owner == null) {
      errorMessages.owner = {
        text: 'Please select who will be involved in ensuring the action is completed',
      }
    } else if (
      req.body.owner.includes('other') &&
      (req.body['other-owner'] == null || req.body['other-owner'].length === 0)
    ) {
      errorMessages.otherOwner = {
        text: 'You selected Other. Please complete this field by providing details in the box, of who will be involved in ensuring the action is completed',
      }
    }
    if (req.body['other-owner'] != null && req.body['other-owner'].trim().split(/\s+/).length > 50) {
      errorMessages.otherOwner = { text: 'Please shorten your details to 50 words or less' }
    }

    if (req.body.status == null) {
      errorMessages.status = { text: 'Please select the status of the action' }
    }

    if (req.body.month === '' || req.body.year === '') {
      errorMessages.targetDate = { text: 'Please enter a target date' }
    } else {
      const date = parseISO(`${req.body.year}-${req.body.month?.padStart(2, '0')}-01`)
      if (!isValid(date)) {
        errorMessages.targetDate = {
          text: 'Please enter a valid date',
        }
      } else if (isPast(endOfMonth(date))) {
        errorMessages.targetDate = {
          text: 'The date entered is in the past, please enter a target date that is in the future',
        }
      }
    }

    if (Object.keys(errorMessages).length > 0) {
      res.render('pages/sentencePlan/action', {
        errorMessages,
        ...(await loadAction(sentencePlanId, objectiveId)),
        action,
      })
      return false
    }
    return true
  }

  function toAction(req: Request): NewAction {
    return {
      description: req.body.description,
      interventionParticipation: req.body['relates-to-intervention'] === 'yes',
      interventionType: req.body['intervention-type'],
      interventionName: getInterventionName(req),
      status: req.body.status,
      individualOwner: req.body.owner?.includes('individual'),
      practitionerOwner: req.body.owner?.includes('practitioner'),
      otherOwner: req.body.owner?.includes('other') ? req.body['other-owner'] : null,
      targetDateMonth: +req.body.month,
      targetDateYear: +req.body.year,
    }
  }

  function getInterventionName(req: Request): string {
    switch (req.body['intervention-type']) {
      case 'accredited-programme':
        return req.body['ap-intervention-name']
      case 'local':
        return req.body['local-intervention-name']
      case 'national':
        return req.body['national-intervention-name']
      case 'other':
        return req.body['other-intervention-name']
      default:
        return null
    }
  }

  get('/sentence-plan/:sentencePlanId/objective/:objectiveId/add-action', async (req, res) => {
    const { sentencePlanId, objectiveId } = req.params
    res.render('pages/sentencePlan/action', await loadAction(sentencePlanId, objectiveId))
  })

  post('/sentence-plan/:sentencePlanId/objective/:objectiveId/add-action', async function addAction(req, res) {
    const { sentencePlanId, objectiveId } = req.params
    if ('cancel' in req.body) {
      res.redirect(`/sentence-plan/${sentencePlanId}/objective/${objectiveId}`)
      return
    }
    const action = toAction(req)
    if (await validateAction(action, sentencePlanId, objectiveId, req, res)) {
      await service.sentencePlanClient.createAction(sentencePlanId, objectiveId, action)
      if ('add-another' in req.body) {
        res.redirect(`/sentence-plan/${sentencePlanId}/objective/${objectiveId}/add-action`)
      } else {
        res.redirect(`/sentence-plan/${sentencePlanId}/objective/${objectiveId}/summary`)
      }
    }
  })

  get('/sentence-plan/:sentencePlanId/objective/:objectiveId/action/:actionId', async (req, res) => {
    const { sentencePlanId, objectiveId, actionId } = req.params
    res.render('pages/sentencePlan/action', await loadAction(sentencePlanId, objectiveId, actionId))
  })

  post('/sentence-plan/:sentencePlanId/objective/:objectiveId/action/:actionId', async function updateAction(req, res) {
    const { sentencePlanId, objectiveId, actionId } = req.params
    if ('cancel' in req.body) {
      res.redirect(`/sentence-plan/${sentencePlanId}/objective/${objectiveId}/summary`)
      return
    }
    const action = { id: actionId, objectiveId, sentencePlanId, ...toAction(req) }
    if (await validateAction(action, sentencePlanId, objectiveId, req, res)) {
      await service.sentencePlanClient.updateAction(sentencePlanId, objectiveId, actionId, action)
      if ('add-another' in req.body) {
        res.redirect(`/sentence-plan/${sentencePlanId}/objective/${objectiveId}/add-action`)
      } else {
        res.redirect(`/sentence-plan/${sentencePlanId}/objective/${objectiveId}/summary`)
      }
    }
  })

  get(
    '/sentence-plan/:sentencePlanId/objective/:objectiveId/action/:actionId/confirmDelete',
    async function deleteAction(req, res) {
      const { sentencePlanId, objectiveId, actionId } = req.params
      res.render('pages/sentencePlan/confirmDeleteAction', {
        ...(await loadAction(sentencePlanId, objectiveId, actionId)),
      })
    },
  )

  post(
    '/sentence-plan/:sentencePlanId/objective/:objectiveId/action/:actionId/delete',
    async function deleteAction(req, res) {
      const { sentencePlanId, objectiveId, actionId } = req.params
      await service.sentencePlanClient.deleteAction(sentencePlanId, objectiveId, actionId)
      res.redirect(`/sentence-plan/${sentencePlanId}/objective/${objectiveId}/summary`)
    },
  )

  interface ErrorMessages {
    [key: string]: { text: string }
  }

  return router
}
