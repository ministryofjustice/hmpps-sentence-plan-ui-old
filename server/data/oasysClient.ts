import RestClient from './restClient'
import config from '../config'
import HmppsAuthClient from './hmppsAuthClient'

export default class OasysClient {
  private restClient = (token: string) => new RestClient('OasysClient', config.apis.oasys, token)

  constructor(private hmppsAuthClient: HmppsAuthClient) {}

  async getNeeds(crn: string): Promise<NeedsResponse> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return this.restClient(token).get({ path: `/needs/${crn}` })
  }
}

interface Need {
  code: string
  description: string
}

export interface NeedsResponse {
  needs: Need[]
}
