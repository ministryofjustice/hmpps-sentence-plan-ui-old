import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({})
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
        expect(res.text).toContain('prototype')
      })
  })
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
