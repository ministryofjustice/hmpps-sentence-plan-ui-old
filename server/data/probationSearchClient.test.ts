import nock from 'nock'
import config from '../config'
import ProbationSearchClient from './probationSearchClient'
import HmppsAuthClient from './hmppsAuthClient'

jest.mock('../data/hmppsAuthClient')

describe('Probation search client', () => {
  let mockProbationSearchApi: nock.Scope
  let mockHmppsAuthClient: jest.Mocked<HmppsAuthClient>
  let probationSearchClient: ProbationSearchClient

  beforeEach(() => {
    mockHmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>
    mockHmppsAuthClient.getSystemClientToken.mockResolvedValue('test token')
    mockProbationSearchApi = nock(config.apis.probationSearch.url)
    probationSearchClient = new ProbationSearchClient(mockHmppsAuthClient)
  })

  afterEach(() => {
    if (!nock.isDone()) {
      nock.cleanAll()
      throw new Error('Not all nock interceptors were used!')
    }
    nock.abortPendingRequests()
    nock.cleanAll()
  })

  describe('search', () => {
    it('should return data from api', async () => {
      const results = {
        totalPages: 1,
        totalElements: 1,
        content: [
          {
            surname: 'test',
            firstName: 'test',
            dateOfBirth: '2000-01-01',
            otherIds: {
              crn: '12345',
            },
          },
        ],
      }

      mockProbationSearchApi.post('/phrase').query({ size: 10, page: 0 }).reply(200, results)

      const output = await probationSearchClient.search('test', 1)

      expect(output).toEqual(results)
    })
  })
})
