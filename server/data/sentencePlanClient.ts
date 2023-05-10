import RestClient from './restClient'
import config from '../config'
import HmppsAuthClient from './hmppsAuthClient'

export default class SentencePlanClient {
  private restClient = (token: string) => new RestClient('SentencePlanClient', config.apis.sentencePlan, token)

  constructor(private hmppsAuthClient: HmppsAuthClient) {}

  async list(crn: string): Promise<SentencePlanListResponse> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).get({ path: `/sentence-plan?crn=${crn}` })
  }

  async get(id: string): Promise<SentencePlan> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).get({ path: `/sentence-plan/${id}` })
  }

  async create(sentencePlan: NewSentencePlan): Promise<SentencePlan> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).post({ path: `/sentence-plan`, data: sentencePlan })
  }

  async update(sentencePlan: SentencePlan): Promise<SentencePlan> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).put({ path: `/sentence-plan/${sentencePlan.id}`, data: sentencePlan })
  }
}

export interface NewSentencePlan extends Record<string, unknown> {
  crn: string
}

export interface SentencePlan extends NewSentencePlan {
  id: string
  status: 'Draft' | 'Active' | 'Closed'
  createdDate: string
  riskFactors: string
  positiveFactors: string
}

export interface SentencePlanListResponse {
  sentencePlans: SentencePlan[]
}
