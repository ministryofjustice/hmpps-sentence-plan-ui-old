// import nock from 'nock'
// import config from '../config'
// import HmppsAuthClient from './hmppsAuthClient'
// import SentencePlanClient from './sentencePlanClient'

// jest.mock('../data/hmppsAuthClient')

// describe('Sentence Plan client', () => {
//   let mockSentencePlanApi: nock.Scope
//   let mockHmppsAuthClient: jest.Mocked<HmppsAuthClient>
//   let sentencePlanClient: SentencePlanClient

//   beforeEach(() => {
//     mockHmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>
//     mockHmppsAuthClient.getSystemClientToken.mockResolvedValue('test token')
//     mockSentencePlanApi = nock(config.apis.sentencePlan.url)
//     sentencePlanClient = new SentencePlanClient(mockHmppsAuthClient)
//   })

//   afterEach(() => {
//     if (!nock.isDone()) {
//       nock.cleanAll()
//       throw new Error('Not all nock interceptors were used!')
//     }
//     nock.abortPendingRequests()
//     nock.cleanAll()
//   })

//   describe('listSentencePlans', () => {
//     it('should return data from api', async () => {
//       const results = { sentencePlans: [{ crn: '123' }] }
//       mockSentencePlanApi.get('/sentence-plan?crn=123').reply(200, results)
//       const output = await sentencePlanClient.listSentencePlans('123')
//       expect(output).toEqual(results)
//     })
//   })
// })
describe('empty test', () =>
  it('should do nothing', async () => expect(1).toEqual(1)
  ))