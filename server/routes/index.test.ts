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

describe('GET /', () => {
  it('should render index page', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Manage a Sentence Plan')
      })
  })
  it('should render a start button', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Start now')
      })
  })
  it('should render the phase tag', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Alpha')
      })
  })
})
