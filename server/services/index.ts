import CaseSearchService from '@ministryofjustice/probation-search-frontend/service/caseSearchService'
import { dataAccess } from '../data'
import HmppsAuthClient from '../data/hmppsAuthClient'
import UserService from './userService'
import SentencePlanClient from '../data/sentencePlanClient'
import DeliusService from './deliusService'
import config from '../config'
import localData from '../data/probationSearchTestData'

export const services = () => {
  const { hmppsAuthClient, sentencePlanClient, deliusClient, interventionsClient, oasysClient, prisonApiClient } =
    dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const deliusService = new DeliusService(deliusClient)
  const searchService = new CaseSearchService({
    oauthClient: hmppsAuthClient,
    environment: config.env,
    localData,
  })

  return {
    hmppsAuthClient,
    userService,
    deliusService,
    searchService,
    sentencePlanClient,
    interventionsClient,
    oasysClient,
    prisonApiClient,
  }
}

export type Services = ReturnType<typeof services>

export { HmppsAuthClient, UserService, SentencePlanClient, DeliusService }
