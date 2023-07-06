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

beforeEach(() => {
  services.deliusService.getCaseDetails = jest.fn().mockResolvedValue({
    crn: '123',
    name: 'Test Case',
    dateOfBirth: '1990-01-01',
    managerName: 'Test',
    tier: 'T1',
  })
  services.sentencePlanClient.getSentencePlan = jest.fn().mockResolvedValue({ crn: '123' })
  services.oasysClient.getNeeds = jest.fn().mockResolvedValue({
    criminogenicNeeds: [
      {
        key: 'accomodation',
        description: 'Accomodation',
      },
      {
        key: 'drugs',
        description: 'Drug misuse',
      },
    ],
  })
})

describe('GET /sentence-plan/add-objective', () => {
  it('description should be blank and needs are hidden', () => {
    return request(app)
      .get('/sentence-plan/1/add-objective')
      .expect('Content-Type', /html/)
      .expect(res => expect(res.text).toContain('></textarea'))
      .expect(res => expect(res.text).toContain('hidden" id="conditional-relates-to-needs"'))
  })

  it('should validate description', () => {
    return request(app)
      .post('/sentence-plan/1/add-objective')
      .send({ description: '' })
      .expect('Content-Type', /html/)
      .expect(res => expect(res.text).toContain('Please write an objective'))
  })

  it('should validate yes/no for relates to needs', () => {
    return request(app)
      .post('/sentence-plan/1/add-objective')
      .send({ description: 'New text' })
      .expect('Content-Type', /html/)
      .expect(res => expect(res.text).toContain('Select yes if this objective relates to a criminogenic need'))
  })

  it('should validate needs', () => {
    return request(app)
      .post('/sentence-plan/1/add-objective')
      .send({ description: 'New text', 'relates-to-needs': 'yes' })
      .expect('Content-Type', /html/)
      .expect(res => expect(res.text).toContain('Select at least one criminogenic need'))
  })

  it('should validate motivation', () => {
    return request(app)
      .post('/sentence-plan/1/add-objective')
      .send({ description: 'New text', 'relates-to-needs': 'yes', needs: [{ code: 'accommodation' }] })
      .expect('Content-Type', /html/)
      .expect(res => expect(res.text).toContain('Please select a motivation level'))
  })

  it('should save data', () => {
    const updateApi = jest.fn().mockResolvedValue({ id: '2' })
    services.sentencePlanClient.createObjective = updateApi
    return request(app)
      .post('/sentence-plan/1/add-objective')
      .send({ description: 'New text', 'relates-to-needs': 'no', motivation: 'Action' })
      .expect(302)
      .expect('Location', '/sentence-plan/1/objective/2/add-action')
      .expect(_ => expect(updateApi).toBeCalledWith('1', { description: 'New text', needs: [], motivation: 'Action' }))
  })
})

describe('GET /sentence-plan/objective', () => {
  beforeEach(() => {
    services.sentencePlanClient.getObjective = jest.fn().mockResolvedValue({
      id: '2',
      description: 'Existing text',
      needs: [{ code: 'drugs' }],
    })
  })

  it('should display existing data', () => {
    return request(app)
      .get('/sentence-plan/1/objective/2')
      .expect('Content-Type', /html/)
      .expect(res => expect(res.text).toContain('Existing text'))
      .expect(res => expect(res.text).toContain('Drug misuse'))
      .expect(res => expect(res.text).toContain('value="drugs" checked'))
  })

  it('should validate description', () => {
    return request(app)
      .post('/sentence-plan/1/objective/2')
      .send({ description: '' })
      .expect('Content-Type', /html/)
      .expect(res => expect(res.text).toContain('Please write an objective'))
  })

  it('should validate yes/no for relates to needs', () => {
    return request(app)
      .post('/sentence-plan/1/objective/2')
      .send({ description: 'New text' })
      .expect('Content-Type', /html/)
      .expect(res => expect(res.text).toContain('Select yes if this objective relates to a criminogenic need'))
  })

  it('should validate needs', () => {
    return request(app)
      .post('/sentence-plan/1/objective/2')
      .send({ description: 'New text', 'relates-to-needs': 'yes' })
      .expect('Content-Type', /html/)
      .expect(res => expect(res.text).toContain('Select at least one criminogenic need'))
  })

  it('should validate motivation', () => {
    return request(app)
      .post('/sentence-plan/1/objective/2')
      .send({ description: 'New text', 'relates-to-needs': 'yes', needs: [{ code: 'accommodation' }] })
      .expect('Content-Type', /html/)
      .expect(res => expect(res.text).toContain('Please select a motivation level'))
  })

  it('should save data', () => {
    const updateApi = jest.fn().mockResolvedValue({})
    services.sentencePlanClient.updateObjective = updateApi
    return request(app)
      .post('/sentence-plan/1/objective/2')
      .send({ description: 'New text', 'relates-to-needs': 'no', needs: [], motivation: 'Contemplation' })
      .expect(302)
      .expect('Location', '/sentence-plan/1/objective/2/summary')
      .expect(_ =>
        expect(updateApi).toBeCalledWith({
          id: '2',
          description: 'New text',
          needs: [],
          motivation: 'Contemplation',
        }),
      )
  })
})

describe('GET /sentence-plan/objective/summary', () => {
  beforeEach(() => {
    services.sentencePlanClient.getObjective = jest.fn().mockResolvedValue({
      id: '2',
      description: 'Existing text',
      needs: [{ code: 'drugs' }],
    })
    services.sentencePlanClient.listActions = jest.fn().mockResolvedValue({
      actions: [
        {
          id: '3',
          description: 'First action',
          interventionParticipation: false,
        },
        {
          id: '4',
          description: 'Second action',
          interventionParticipation: true,
          interventionName: 'My intervention',
        },
      ],
    })
  })

  it('should display objective summary and actions', () => {
    return request(app)
      .get('/sentence-plan/1/objective/2/summary')
      .expect('Content-Type', /html/)
      .expect(res => expect(res.text).toContain('Existing text'))
      .expect(res => expect(res.text).toContain('Drug misuse'))
      .expect(res => expect(res.text).toContain('First action'))
      .expect(res => expect(res.text).toContain('Second action'))
      .expect(res => expect(res.text).toContain('My intervention'))
  })

  it('can delete an action', () => {
    const api = jest.fn().mockResolvedValue({})
    services.sentencePlanClient.deleteAction = api
    return request(app)
      .post('/sentence-plan/1/objective/2/action/3/delete')
      .expect(302)
      .expect('Location', '/sentence-plan/1/objective/2/summary')
      .expect(_ => expect(api).toBeCalledWith('1', '2', '3'))
  })

  it('can delete an objective', () => {
    const api = jest.fn().mockResolvedValue({})
    services.sentencePlanClient.deleteObjective = api
    return request(app)
      .post('/sentence-plan/1/objective/2/delete')
      .expect(302)
      .expect('Location', '/sentence-plan/1/summary')
      .expect(_ => expect(api).toBeCalledWith('1', '2'))
  })
})
