import { Request, type RequestHandler, Response, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { formatDate } from '../utils/utils'

export default function sentencePlanRoutes(router: Router, service: Services): Router {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  async function loadSentencePlan(id: string) {
    const sentencePlan = await service.sentencePlanClient.getSentencePlan(id)
    const caseDetails = await service.deliusService.getCaseDetails(sentencePlan.crn)
    return { caseDetails, sentencePlan }
  }

  async function errorMessage(page: string, text: string, req: Request, res: Response) {
    res.render(`pages/sentencePlan/${page}`, { ...(await loadSentencePlan(req.params.id)), errorMessage: { text } })
  }

  get('/case/:crn', async function loadCaseSummary(req, res) {
    const { crn } = req.params
    const [caseDetails, { sentencePlans }, initialAppointment] = await Promise.all([
      service.deliusService.getCaseDetails(crn),
      service.sentencePlanClient.listSentencePlans(crn),
      service.deliusService.getInitialAppointmentDate(crn),
    ])

    res.render('pages/case', {
      caseDetails,
      head: [{ text: 'Date' }, { text: 'Status' }, {}],
      rows: sentencePlans.map(it => [
        { html: `<span title="${it.createdDate}">${formatDate(it.createdDate)}</span>` },
        { html: `<strong class="moj-badge">${it.status}</strong>` },
        { html: `<a href='/sentence-plan/${it.id}/summary'>View</a>` },
      ]),
      hasDraft: sentencePlans.some(it => it.status === 'Draft'),
      initialAppointmentDate:
        initialAppointment.appointmentDate !== undefined
          ? formatDate(initialAppointment.appointmentDate)
          : 'No initial appointment found',
    })
  })

  get('/case/:crn/create-sentence-plan', async function createSentencePlan(req, res) {
    const { crn } = req.params
    const { id } = await service.sentencePlanClient.createSentencePlan({ crn })
    res.redirect(`/sentence-plan/${id}/summary`)
  })

  get('/sentence-plan/:id/summary', async function loadSentencePlanSummary(req, res) {
    const { id } = req.params
    const [sentencePlan, objectivesList] = await Promise.all([
      service.sentencePlanClient.getSentencePlan(id),
      service.sentencePlanClient.listObjectives(id),
    ])
    const caseDetails = await service.deliusService.getCaseDetails(sentencePlan.crn)
    const objectives = objectivesList.objectives.map((it, i) => ({
      text: `${i + 1}. ${it.description}`,
      href: `./objective/${it.id}/summary`,
      attributes: { 'data-actions': it.actionsCount || 0 },
    }))
    res.render('pages/sentencePlan/summary', { caseDetails, sentencePlan, objectives })
  })

  get('/sentence-plan/:id/engagement-and-compliance', async (req, res) => {
    res.render('pages/sentencePlan/engagementAndCompliance', await loadSentencePlan(req.params.id))
  })

  post('/sentence-plan/:id/engagement-and-compliance', async function updateEngagementAndCompliance(req, res) {
    const { id } = req.params
    const existingSentencePlan = await service.sentencePlanClient.getSentencePlan(id)
    await service.sentencePlanClient.updateSentencePlan({
      ...existingSentencePlan,
      riskFactors: req.body['risk-factors'],
      protectiveFactors: req.body['protective-factors'],
    })
    res.redirect(`/sentence-plan/${id}/summary`)
  })

  get('/sentence-plan/:id/your-decisions', async (req, res) => {
    res.render('pages/sentencePlan/yourDecisions', await loadSentencePlan(req.params.id))
  })

  post('/sentence-plan/:id/your-decisions', async function updatePractitionerComments(req, res) {
    const { id } = req.params
    const practitionerComments = req.body['practitioner-comments']
    if (practitionerComments.length === 0)
      await errorMessage('Please enter your decisions', 'practitionerComments', req, res)
    if (practitionerComments.length > 5000)
      await errorMessage('Your decisions must be 5000 characters or less', 'practitionerComments', req, res)

    const existingSentencePlan = await service.sentencePlanClient.getSentencePlan(id)
    await service.sentencePlanClient.updateSentencePlan({ ...existingSentencePlan, practitionerComments })
    res.redirect(`/sentence-plan/${id}/summary`)
  })

  get('/sentence-plan/:id/individuals-comments', async (req, res) => {
    res.render('pages/sentencePlan/individualsComments', await loadSentencePlan(req.params.id))
  })

  post('/sentence-plan/:id/individuals-comments', async function updateIndividualsComments(req, res) {
    const { id } = req.params
    const individualComments = req.body['individual-comments']
    if (individualComments.length > 5000)
      await errorMessage("Individual's comments must be 5000 characters or less", 'individualsComments', req, res)

    const existingSentencePlan = await service.sentencePlanClient.getSentencePlan(id)
    await service.sentencePlanClient.updateSentencePlan({ ...existingSentencePlan, individualComments })
    res.redirect(`/sentence-plan/${id}/summary`)
  })

  return router
}
