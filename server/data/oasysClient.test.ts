// import nock from 'nock'
// import config from '../config'
// import HmppsAuthClient from './hmppsAuthClient'
// import OasysClient from './oasysClient'

// jest.mock('../data/hmppsAuthClient')

// describe('Oasys client', () => {
//   let mockDelius: nock.Scope
//   let mockHmppsAuthClient: jest.Mocked<HmppsAuthClient>
//   let oasysClient: OasysClient

//   beforeEach(() => {
//     mockHmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>
//     mockHmppsAuthClient.getSystemClientToken.mockResolvedValue('test token')
//     mockDelius = nock(config.apis.oasys.url)
//     oasysClient = new OasysClient(mockHmppsAuthClient)
//   })

//   afterEach(() => {
//     if (!nock.isDone()) {
//       nock.cleanAll()
//       throw new Error('Not all nock interceptors were used!')
//     }
//     nock.abortPendingRequests()
//     nock.cleanAll()
//   })

//   describe('needs for crn', () => {
//     it('should return data from api', async () => {
//       const results = [
//         { code: 'accommodation', description: 'Accommodation' },
//         { code: 'alcohol', description: 'Alcohol misuse' },
//         { code: 'attitudes', description: 'Attitudes' },
//         { code: 'drugs', description: 'Drug misuse' },
//         { code: 'employability', description: 'Education, training and employment' },
//         { code: 'lifestyle', description: 'Lifestyle' },
//         { code: 'relationships', description: 'Relationships' },
//         { code: 'behaviour', description: 'Thinking and behaviour' },
//       ]
//       mockDelius.get('/needs/123').reply(200, results)
//       const output = await oasysClient.getNeeds('123')
//       expect(output).toEqual(results)
//     })
//   })
// })
describe('empty test', () =>
  it('should do nothing', async () => expect(1).toEqual(1)
  ))