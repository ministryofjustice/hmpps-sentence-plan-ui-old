import nock from 'nock'
import config from '../config'
import HmppsAuthClient from './hmppsAuthClient'
import DeliusClient from './deliusClient'

jest.mock('../data/hmppsAuthClient')

describe('Delius client', () => {
  let mockDelius: nock.Scope
  let mockHmppsAuthClient: jest.Mocked<HmppsAuthClient>
  let deliusClient: DeliusClient

  beforeEach(() => {
    mockHmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>
    mockHmppsAuthClient.getSystemClientToken.mockResolvedValue('test token')
    mockDelius = nock(config.apis.delius.url)
    deliusClient = new DeliusClient(mockHmppsAuthClient)
  })

  afterEach(() => {
    if (!nock.isDone()) {
      nock.cleanAll()
      throw new Error('Not all nock interceptors were used!')
    }
    nock.abortPendingRequests()
    nock.cleanAll()
  })

  describe('case details', () => {
    it('should return data from api', async () => {
      const results = { crn: '123' }
      mockDelius.get('/case-details/123').reply(200, results)
      const output = await deliusClient.getCaseDetails('123')
      expect(output).toEqual(results)
    })
  })
})
