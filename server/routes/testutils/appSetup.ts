import path from 'path'
import express, { Express } from 'express'
import cookieSession from 'cookie-session'
import createError from 'http-errors'

import CaseSearchService from '@ministryofjustice/probation-search-frontend/service/caseSearchService'
import routes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import * as auth from '../../authentication/auth'
import { DeliusService, Services, UserService } from '../../services'
import { HmppsAuthClient, SentencePlanClient } from '../../data'
import InterventionsClient from '../../data/interventionsClient'
import OasysClient from '../../data/oasysClient'
import PrisonApiClient from '../../data/prisonApiClient'

export const user = {
  firstName: 'first',
  lastName: 'last',
  userId: 'id',
  token: 'token',
  username: 'user1',
  displayName: 'First Last',
  activeCaseLoadId: 'MDI',
  authSource: 'NOMIS',
}

export const flashProvider = jest.fn()

export function mockServices(): Services {
  return {
    hmppsAuthClient: new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>,
    userService: new UserService(null) as jest.Mocked<UserService>,
    deliusService: new DeliusService(null) as jest.Mocked<DeliusService>,
    searchService: new CaseSearchService(null) as jest.Mocked<CaseSearchService>,
    sentencePlanClient: new SentencePlanClient(null) as jest.Mocked<SentencePlanClient>,
    interventionsClient: new InterventionsClient(null) as jest.Mocked<InterventionsClient>,
    oasysClient: new OasysClient(null) as jest.Mocked<OasysClient>,
    prisonApiClient: new PrisonApiClient(null) as jest.Mocked<PrisonApiClient>,
  }
}

function appSetup(services: Services, production: boolean, userSupplier: () => Express.User): Express {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app, path)
  app.use(cookieSession({ keys: [''] }))
  app.use((req, res, next) => {
    req.user = userSupplier()
    req.flash = flashProvider
    res.locals = {}
    res.locals.user = { ...req.user }
    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(routes(services))
  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(production))

  return app
}

export function appWithAllRoutes({
  production = false,
  services = mockServices(),
  userSupplier = () => user,
}: {
  production?: boolean
  services?: Partial<Services>
  userSupplier?: () => Express.User
}): Express {
  auth.default.authenticationMiddleware = () => (req, res, next) => next()
  return appSetup(services as Services, production, userSupplier)
}
