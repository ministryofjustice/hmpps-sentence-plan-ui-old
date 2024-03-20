// import nock from 'nock'
// import config from '../config'
// import HmppsAuthClient from './hmppsAuthClient'
// import PrisonApiClient from './prisonApiClient'

// jest.mock('../data/hmppsAuthClient')

// describe('Prison api client', () => {
//   let mockDelius: nock.Scope
//   let mockHmppsAuthClient: jest.Mocked<HmppsAuthClient>
//   let prisonApiClient: PrisonApiClient

//   beforeEach(() => {
//     mockHmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>
//     mockHmppsAuthClient.getSystemClientToken.mockResolvedValue('test token')
//     mockDelius = nock(config.apis.prisonApi.url)
//     prisonApiClient = new PrisonApiClient(mockHmppsAuthClient)
//   })

//   afterEach(() => {
//     if (!nock.isDone()) {
//       nock.cleanAll()
//       throw new Error('Not all nock interceptors were used!')
//     }
//     nock.abortPendingRequests()
//     nock.cleanAll()
//   })

//   describe('arrival into custody date', () => {
//     it('should return data from api', async () => {
//       const results = { sentenceDetail: { sentenceStartDate: '12/12/1999' } }
//       mockDelius.get('/api/offenders/123/sentences').reply(200, results)
//       const output = await prisonApiClient.getArrivalIntoCustodyDate('123')
//       expect(output).toEqual(results)
//     })
//   })
// })
describe('empty test', () =>
  it('should do nothing', async () => expect(1).toEqual(1)
  ))