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

describe('GET /search', () => {
  it('should render search page', () => {
    return request(app)
      .get('/search')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Search')
      })
  })

  it('should redirect on post', () => {
    return request(app).post('/search').send({ search: 'test' }).expect('Location', '/search?q=test')
  })
})
