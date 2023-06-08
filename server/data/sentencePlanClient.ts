import RestClient from './restClient'
import config from '../config'
import HmppsAuthClient from './hmppsAuthClient'

export default class SentencePlanClient {
  private restClient = (token: string) => new RestClient('SentencePlanClient', config.apis.sentencePlan, token)

  constructor(private hmppsAuthClient: HmppsAuthClient) {}

  async listSentencePlans(crn: string): Promise<SentencePlanListResponse> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).get({ path: `/sentence-plan?crn=${crn}` })
  }

  async getSentencePlan(id: string): Promise<SentencePlan> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).get({ path: `/sentence-plan/${id}` })
  }

  async createSentencePlan(sentencePlan: NewSentencePlan): Promise<SentencePlan> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).post({ path: `/sentence-plan`, data: sentencePlan })
  }

  async updateSentencePlan(sentencePlan: SentencePlan): Promise<SentencePlan> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).put({ path: `/sentence-plan/${sentencePlan.id}`, data: sentencePlan })
  }

  async listObjectives(sentencePlanId: string): Promise<ObjectiveListResponse> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).get({ path: `/sentence-plan/${sentencePlanId}/objective` })
  }

  async getObjective(sentencePlanId: string, objectiveId: string): Promise<Objective> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).get({ path: `/sentence-plan/${sentencePlanId}/objective/${objectiveId}` })
  }

  async createObjective(sentencePlanId: string, objective: NewObjective): Promise<Objective> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).post({ path: `/sentence-plan/${sentencePlanId}/objective`, data: objective })
  }

  async updateObjective(sentencePlanId: string, objectiveId: string, objective: NewObjective): Promise<Objective> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).put({
      path: `/sentence-plan/${sentencePlanId}/objective/${objectiveId}`,
      data: objective,
    })
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

export interface NewObjective extends Record<string, unknown> {
  description: string
  needs: Array<string>
}

export interface Objective extends NewObjective {
  id: string
  sentencePlanId: string
  actionsCount: number
}

export interface ObjectiveListResponse {
  objectives: Objective[]
}
