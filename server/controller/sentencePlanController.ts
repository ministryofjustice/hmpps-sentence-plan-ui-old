import { RequestHandler } from 'express'
import SentencePlanClient from '../data/sentencePlanClient'
import DeliusService from '../services/deliusService'
import { formatDate } from '../utils/utils'

export default class SentencePlanController {
  constructor(private readonly sentencePlanClient: SentencePlanClient, private readonly deliusService: DeliusService) {}

  loadCase: RequestHandler = async (req, res) => {
    const { crn } = req.params
    const [caseDetails, { sentencePlans }] = await Promise.all([
      this.deliusService.getCaseDetails(crn),
      this.sentencePlanClient.list(crn),
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
  }

  create: RequestHandler = async (req, res) => {
    const { crn } = req.params
    const { id } = await this.sentencePlanClient.create({ crn })
    res.redirect(`/sentence-plan/${id}/summary`)
  }

  summary: RequestHandler = async (req, res) => {
    const { id } = req.params
    const sentencePlan = await this.sentencePlanClient.get(id)
    const caseDetails = await this.deliusService.getCaseDetails(sentencePlan.crn)
    res.render(`pages/sentencePlan/summary`, { caseDetails, sentencePlan })
  }
}
