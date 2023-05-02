import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, mockServices } from './testutils/appSetup'

let app: Express
const services = mockServices()

beforeEach(() => {
  app = appWithAllRoutes({ services })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /case', () => {
  beforeEach(() => {
    services.deliusService.getCaseDetails = jest.fn().mockResolvedValue({
      crn: '123',
      name: 'Test Case',
      dateOfBirth: '1990-01-01',
      managerName: 'Test',
      tier: 'T1',
    })
    services.sentencePlanClient.list = jest.fn().mockResolvedValue({ sentencePlans: [] })
  })

  it('should render case details banner', () => {
    return request(app)
      .get('/case/123')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Test Case')
        expect(res.text).toContain('T1')
      })
  })

  it('should display a message when there are no sentence plans', () => {
    return request(app)
      .get('/case/123')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Test Case does not have a sentence plan yet.')
        expect(res.text).toContain('Create a sentence plan')
      })
  })

  it('should display existing sentence plans', () => {
    services.sentencePlanClient.list = jest.fn().mockResolvedValue({
      sentencePlans: [
        {
          id: '123',
          crn: '123',
          status: 'Draft',
          createdDate: '2023-05-01',
        },
      ],
    })
    return request(app)
      .get('/case/123')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Draft')
        expect(res.text).toContain('2023-05-01')
      })
  })
})
