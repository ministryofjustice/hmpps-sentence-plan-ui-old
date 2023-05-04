import { DeliusClient } from '../data'
import DeliusService from './deliusService'

jest.mock('../data/deliusClient')

const crn = '123'

describe('Delius service', () => {
  let deliusClient: jest.Mocked<DeliusClient>
  let deliusService: DeliusService

  describe('getCaseDetails', () => {
    beforeEach(() => {
      deliusClient = new DeliusClient(null) as jest.Mocked<DeliusClient>
      deliusService = new DeliusService(deliusClient)
    })

    it('retrieves and formats data', async () => {
      deliusClient.getCaseDetails = jest.fn().mockResolvedValue({
        name: {
          forename: 'John',
          middleName: ' ',
          surname: 'Smith',
        },
        dateOfBirth: '1990-01-01',
        keyWorker: {
          unallocated: false,
          name: {
            forename: 'Test1',
            middleName: 'Test2',
            surname: 'Test3',
          },
        },
      })

      const result = await deliusService.getCaseDetails(crn)

      expect(result.name).toEqual('John Smith')
      expect(result.managerName).toEqual('Test1 Test2 Test3')
      expect(result.dateOfBirth).toEqual('01/01/1990')
    })

    it('handles unallocated manager', async () => {
      deliusClient.getCaseDetails = jest.fn().mockResolvedValue({
        dateOfBirth: '1990-01-01',
        keyWorker: {
          unallocated: true,
          name: {
            forename: 'Unallocated Staff',
            surname: 'Unallocated Staff',
          },
        },
      })

      const result = await deliusService.getCaseDetails(crn)

      expect(result.managerName).toEqual('Unallocated')
    })

    it('propagates error', async () => {
      deliusClient.getCaseDetails.mockRejectedValue(new Error('some error'))

      await expect(deliusService.getCaseDetails(crn)).rejects.toEqual(new Error('some error'))
    })
  })
})
