import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { formatDate } from '../utils/utils'

export default function sentencePlanRoutes(router: Router, service: Services): Router {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/case/:crn', async function loadCaseSummary(req, res) {
    const { crn } = req.params
    const [caseDetails, { sentencePlans }] = await Promise.all([
      service.deliusService.getCaseDetails(crn),
      service.sentencePlanClient.list(crn),
    ])

    res.render('pages/case', {
      caseDetails,
      head: [{ text: 'Date' }, { text: 'Status' }, {}],
      rows: sentencePlans.map(it => [
        { html: `<span title="${it.createdDate}">${formatDate(it.createdDate)}</span>` },
        { html: `<strong class="moj-badge">${it.status}</strong>` },
        { html: `<a href='/sentence-plan/${it.id}/summary'>View</a>` },
      ]),
    })
  })

  get('/case/:crn/create-sentence-plan', async function createSentencePlan(req, res) {
    const { crn } = req.params
    const { id } = await service.sentencePlanClient.create({ crn })
    res.redirect(`/sentence-plan/${id}/summary`)
  })

  get('/sentence-plan/:id/summary', async function loadSentencePlanSummary(req, res) {
    res.render('pages/sentencePlan/summary', await loadContext(req.params.id))
  })

  get('/sentence-plan/:id/engagement-and-compliance', async (req, res) => {
    res.render('pages/sentencePlan/engagementAndCompliance', await loadContext(req.params.id))
  })

  post('/sentence-plan/:id/engagement-and-compliance', async function updateEngagementAndCompliance(req, res) {
    const { id } = req.params
    const { riskFactors, positiveFactors } = req.body
    const existingSentencePlan = await service.sentencePlanClient.get(id)
    await service.sentencePlanClient.update({ ...existingSentencePlan, riskFactors, positiveFactors })
    res.redirect(`/sentence-plan/${id}/summary`)
  })

  get('/sentence-plan/:id/add-objective', async (req, res) => {
    res.render('pages/sentencePlan/addObjective', await loadContext(req.params.id))
  })

  const loadContext = async (id: string) => {
    const sentencePlan = await service.sentencePlanClient.get(id)
    const caseDetails = await service.deliusService.getCaseDetails(sentencePlan.crn)
    return { caseDetails, sentencePlan }
  }

  return router
}
