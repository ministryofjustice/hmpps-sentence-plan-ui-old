import RestClient from './restClient'
import config from '../config'
import HmppsAuthClient from './hmppsAuthClient'

export default class ProbationSearchClient {
  private restClient = (token: string) => new RestClient('ProbationSearchClient', config.apis.probationSearch, token)

  constructor(private hmppsAuthClient: HmppsAuthClient) {}

  async search(query: string, page = 0, asUsername: string = null): Promise<PersonSearchResponse> {
    const token = await this.hmppsAuthClient.getSystemClientToken(asUsername)
    return this.restClient(token).post({
      path: `/phrase?page=${page - 1}&size=10`,
      data: {
        phrase: query,
        matchAllTerms: true,
      },
    })
  }
}

export interface PersonSearchResponse {
  content: {
    firstName: string
    middleNames: string
    surname: string
    dateOfBirth: string
    otherIds: {
      crn: string
    }
  }[]
  size: number
  totalElements: number
  totalPages: number
}
