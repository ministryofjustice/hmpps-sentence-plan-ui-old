import RestClient from './restClient'
import config from '../config'
import HmppsAuthClient from './hmppsAuthClient'

export default class PrisonApiClient {
  private restClient = (token: string) => new RestClient('PrisonApiClient', config.apis.prisonApi, token)

  constructor(private hmppsAuthClient: HmppsAuthClient) {}

  async getArrivalIntoCustodyDate(nomisId: string): Promise<Sentence> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).get({ path: `/api/offenders/${nomisId}/sentences` })
  }
}

export interface Sentence {
  sentenceDetail?: SentenceDetail
}
export interface SentenceDetail {
  sentenceStartDate?: string
}
