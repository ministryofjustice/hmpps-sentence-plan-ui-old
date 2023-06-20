import express, { Express } from 'express'
import cookieSession from 'cookie-session'
import createError from 'http-errors'
import path from 'path'

import routes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import * as auth from '../../authentication/auth'
import { DeliusService, Services, UserService } from '../../services'
import { ProbationSearchClient, SentencePlanClient } from '../../data'
import InterventionsClient from '../../data/interventionsClient'

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
    userService: new UserService(null) as jest.Mocked<UserService>,
    deliusService: new DeliusService(null) as jest.Mocked<DeliusService>,
    probationSearchClient: new ProbationSearchClient(null) as jest.Mocked<ProbationSearchClient>,
    sentencePlanClient: new SentencePlanClient(null) as jest.Mocked<SentencePlanClient>,
    interventionsClient: new InterventionsClient(null) as jest.Mocked<InterventionsClient>,
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
  services = {},
  userSupplier = () => user,
}: {
  production?: boolean
  services?: Partial<Services>
  userSupplier?: () => Express.User
}): Express {
  auth.default.authenticationMiddleware = () => (req, res, next) => next()
  return appSetup(services as Services, production, userSupplier)
}
