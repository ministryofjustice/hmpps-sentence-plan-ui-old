import { type RequestHandler, Router } from 'express'
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

  get('/case/:crn', async function loadCaseSummary(req, res) {
    const { crn } = req.params
    const [caseDetails, { sentencePlans }] = await Promise.all([
      service.deliusService.getCaseDetails(crn),
      service.sentencePlanClient.listSentencePlans(crn),
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
    const { riskFactors, protectiveFactors } = req.body
    const existingSentencePlan = await service.sentencePlanClient.getSentencePlan(id)
    await service.sentencePlanClient.updateSentencePlan({ ...existingSentencePlan, riskFactors, protectiveFactors })
    res.redirect(`/sentence-plan/${id}/summary`)
  })

  return router
}
