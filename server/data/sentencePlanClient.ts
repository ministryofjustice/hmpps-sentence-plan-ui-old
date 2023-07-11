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

  async deleteSentencePlan(sentencePlanId: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).delete({ path: `/sentence-plan/${sentencePlanId}` })
  }

  async listObjectives(sentencePlanId: string): Promise<ObjectiveListResponse> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).get({ path: `/sentence-plan/${sentencePlanId}/objective` })
  }

  async getObjective(sentencePlanId: string, objectiveId: string): Promise<Objective> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).get({ path: `/sentence-plan/${sentencePlanId}/objective/${objectiveId}` })
  }

  async deleteObjective(sentencePlanId: string, objectiveId: string) {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).delete({ path: `/sentence-plan/${sentencePlanId}/objective/${objectiveId}` })
  }

  async createObjective(sentencePlanId: string, objective: NewObjective): Promise<Objective> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).post({ path: `/sentence-plan/${sentencePlanId}/objective`, data: objective })
  }

  async updateObjective(objective: Objective): Promise<Objective> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).put({
      path: `/sentence-plan/${objective.sentencePlanId}/objective/${objective.id}`,
      data: objective,
    })
  }

  async listActions(sentencePlanId: string, objectiveId: string): Promise<ActionListResponse> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).get({ path: `/sentence-plan/${sentencePlanId}/objective/${objectiveId}/action` })
  }

  async getAction(sentencePlanId: string, objectiveId: string, actionId: string): Promise<Action> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).get({
      path: `/sentence-plan/${sentencePlanId}/objective/${objectiveId}/action/${actionId}`,
    })
  }

  async createAction(sentencePlanId: string, objectiveId: string, action: NewAction): Promise<Action> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).post({
      path: `/sentence-plan/${sentencePlanId}/objective/${objectiveId}/action`,
      data: action,
    })
  }

  async updateAction(
    sentencePlanId: string,
    objectiveId: string,
    actionId: string,
    action: NewAction,
  ): Promise<Action> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).put({
      path: `/sentence-plan/${sentencePlanId}/objective/${objectiveId}/action/${actionId}`,
      data: action,
    })
  }

  async deleteAction(sentencePlanId: string, objectiveId: string, actionId: string): Promise<void> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).delete({
      path: `/sentence-plan/${sentencePlanId}/objective/${objectiveId}/action/${actionId}`,
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
  protectiveFactors: string
}

export interface SentencePlanListResponse {
  sentencePlans: SentencePlan[]
}

export interface NewObjective extends Record<string, unknown> {
  description: string
  needs: Need[]
}

export interface Need {
  code: string
}

export interface Objective extends NewObjective {
  id: string
  sentencePlanId: string
  actionsCount: number
}

export interface ObjectiveListResponse {
  objectives: Objective[]
}

export interface NewAction extends Record<string, unknown> {
  description: string
  interventionParticipation: boolean
  interventionName?: string
  interventionType?: 'accredited-programme' | 'local' | 'national' | 'other'
  status: string
  individualOwner: boolean
  practitionerOwner: boolean
  otherOwner?: string
  targetDateMonth: number
  targetDateYear: number
}

export interface Action extends NewAction {
  id: string
  objectiveId: string
}

export interface ActionListResponse {
  actions: Action[]
}
