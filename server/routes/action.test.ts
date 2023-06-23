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
  services.sentencePlanClient.getObjective = jest
    .fn()
    .mockResolvedValue({ crn: '123', description: 'Existing objective' })
  services.interventionsClient.getNationalInterventionNames = jest
    .fn()
    .mockResolvedValue(['Intervention A', 'Intervention B'])
})

describe('GET /sentence-plan/objective/add-action', () => {
  it('description should be blank and intervention types are hidden', () => {
    return request(app)
      .get('/sentence-plan/1/objective/2/add-action')
      .expect('Content-Type', /html/)
      .expect(res => expect(res.text).toContain('></textarea'))
      .expect(res => expect(res.text).toContain('id="intervention-type-container" class="govuk-visually-hidden"'))
  })

  it('should display national interventions list', () => {
    return request(app)
      .get('/sentence-plan/1/objective/2/add-action')
      .expect('Content-Type', /html/)
      .expect(res => expect(res.text).toContain('Intervention A'))
      .expect(res => expect(res.text).toContain('Intervention B'))
  })

  it('should validate description', () => {
    return request(app)
      .post('/sentence-plan/1/objective/2/add-action')
      .send({ description: '' })
      .expect('Content-Type', /html/)
      .expect(res => expect(res.text).toContain('Please write an action'))
  })

  it('should validate yes/no for relates to intervention', () => {
    return request(app)
      .post('/sentence-plan/1/objective/2/add-action')
      .send({ description: 'New text' })
      .expect('Content-Type', /html/)
      .expect(res => expect(res.text).toContain('Select yes if this action involves an intervention programme'))
  })

  it('should validate intervention type', () => {
    return request(app)
      .post('/sentence-plan/1/objective/2/add-action')
      .send({ description: 'New text', 'relates-to-intervention': 'yes' })
      .expect('Content-Type', /html/)
      .expect(res => expect(res.text).toContain('Select a type of intervention'))
  })

  it('should validate intervention name', () => {
    return request(app)
      .post('/sentence-plan/1/objective/2/add-action')
      .send({ description: 'New text', 'relates-to-intervention': 'yes', 'intervention-type': 'accredited-programme' })
      .expect('Content-Type', /html/)
      .expect(res => expect(res.text).toContain('Enter the name of the accredited programme'))
  })

  it('should save data', () => {
    const api = jest.fn().mockResolvedValue({})
    services.sentencePlanClient.createAction = api
    return request(app)
      .post('/sentence-plan/1/objective/2/add-action')
      .send({
        description: 'New text',
        'relates-to-intervention': 'yes',
        'intervention-type': 'accredited-programme',
        'ap-intervention-name': 'Building Better Relationships',
        continue: true,
      })
      .expect(302)
      .expect('Location', '/sentence-plan/1/objective/2/summary')
      .expect(_ =>
        expect(api).toBeCalledWith('1', '2', {
          description: 'New text',
          interventionParticipation: true,
          interventionType: 'accredited-programme',
          interventionName: 'Building Better Relationships',
          individualOwner: false,
          practitionerOwner: false,
          otherOwner: null,
          status: 'Draft',
        }),
      )
  })

  it('add another should save and reload page', () => {
    const api = jest.fn().mockResolvedValue({})
    services.sentencePlanClient.createAction = api
    return request(app)
      .post('/sentence-plan/1/objective/2/add-action')
      .send({
        description: 'New text',
        'relates-to-intervention': 'yes',
        'intervention-type': 'accredited-programme',
        'ap-intervention-name': 'Building Better Relationships',
        'add-another': true,
      })
      .expect(302)
      .expect('Location', '/sentence-plan/1/objective/2/add-action')
      .expect(_ =>
        expect(api).toBeCalledWith('1', '2', {
          description: 'New text',
          interventionParticipation: true,
          interventionType: 'accredited-programme',
          interventionName: 'Building Better Relationships',
          individualOwner: false,
          practitionerOwner: false,
          otherOwner: null,
          status: 'Draft',
        }),
      )
  })
})

describe('GET /sentence-plan/objective/action', () => {
  beforeEach(() => {
    services.sentencePlanClient.getAction = jest.fn().mockResolvedValue({
      id: '3',
      description: 'Existing action',
      interventionParticipation: true,
      interventionType: 'local',
      interventionName: 'Existing intervention name',
    })
  })

  it('should display existing data', () => {
    return request(app)
      .get('/sentence-plan/1/objective/2/action/3')
      .expect('Content-Type', /html/)
      .expect(res => expect(res.text).toContain('Existing objective'))
      .expect(res => expect(res.text).toContain('Existing action'))
      .expect(res => expect(res.text).toContain('value="yes" checked'))
      .expect(res => expect(res.text).toContain('value="local" checked'))
      .expect(res => expect(res.text).toContain('Existing intervention name'))
  })

  it('should save data', () => {
    const api = jest.fn().mockResolvedValue({})
    services.sentencePlanClient.updateAction = api
    return request(app)
      .post('/sentence-plan/1/objective/2/action/3')
      .send({
        description: 'New text',
        'relates-to-intervention': 'yes',
        'intervention-type': 'accredited-programme',
        'ap-intervention-name': 'Building Better Relationships',
        continue: true,
      })
      .expect(302)
      .expect('Location', '/sentence-plan/1/objective/2/summary')
      .expect(_ =>
        expect(api).toBeCalledWith('1', '2', '3', {
          id: '3',
          objectiveId: '2',
          sentencePlanId: '1',
          description: 'New text',
          interventionParticipation: true,
          interventionType: 'accredited-programme',
          interventionName: 'Building Better Relationships',
          individualOwner: false,
          practitionerOwner: false,
          otherOwner: null,
          status: 'Draft',
        }),
      )
  })
})
