import RestClient from './restClient'
import config from '../config'
import HmppsAuthClient from './hmppsAuthClient'

export default class OasysClient {
  private restClient = (token: string) => new RestClient('OasysClient', config.apis.oasys, token)

  constructor(private hmppsAuthClient: HmppsAuthClient) {
    // nothing to do
  }

  async getNeeds(crn: string): Promise<NeedsResponse> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).get({ path: `/needs/${crn}` })
  }
}

export interface Need {
  key: string
  description: string
}

export interface NeedsResponse {
  criminogenicNeeds: Need[]
}
