import RestClient from './restClient'
import config from '../config'
import HmppsAuthClient from './hmppsAuthClient'

export default class InterventionsClient {
  private restClient = (token: string) => new RestClient('InterventionsClient', config.apis.interventions, token)

  constructor(private hmppsAuthClient: HmppsAuthClient) {
    // nothing to do
  }

  async getNationalInterventionNames(): Promise<string[]> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    const interventions = await this.restClient(token).get<Intervention[]>({ path: `/interventions` })
    return interventions.map(intervention => intervention.title).sort()
  }
}

export interface Intervention {
  id: string
  title: string
}
