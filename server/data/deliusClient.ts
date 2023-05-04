import RestClient from './restClient'
import config from '../config'
import HmppsAuthClient from './hmppsAuthClient'

export default class DeliusClient {
  private restClient = (token: string) => new RestClient('DeliusClient', config.apis.delius, token)

  constructor(private hmppsAuthClient: HmppsAuthClient) {}

  async getCaseDetails(crn: string): Promise<CaseDetailsResponse> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).get({ path: `/case-details/${crn}` })
  }
}

export interface Name {
  forename: string
  middleName?: string
  surname: string
}

export interface CaseDetailsResponse {
  crn: string
  nomsNumber?: string
  name: Name
  dateOfBirth: string
  keyWorker?: {
    name: Name
    unallocated: boolean
  }
  region?: string
  tier?: string
}
