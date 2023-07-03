import Sender from 'applicationinsights/out/Library/Sender'
import RestClient from './restClient'
import config from '../config'
import HmppsAuthClient from './hmppsAuthClient'

export default class PrisonApiClient {
  private restClient = (token: string) => new RestClient('PrisonApiClient', config.apis.prisonApi, token)

  constructor(private hmppsAuthClient: HmppsAuthClient) {}

  async getArrivalIntoCustodyDate(nomsNumber: string): Promise<Sentence> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).get({ path: `/api/offenders/${nomsNumber}/sentences` })
  }
}

export interface Sentence {
  sentenceDetail?: SentenceDetail
}

export interface SentenceDetail {
  sentenceStartDate?: string
}
