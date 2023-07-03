import { dataAccess } from '../data'
import UserService from './userService'
import ProbationSearchClient from '../data/probationSearchClient'
import SentencePlanClient from '../data/sentencePlanClient'
import DeliusService from './deliusService'
import PrisonApiClient from '../data/prisonApiClient'

export const services = () => {
  const {
    hmppsAuthClient,
    probationSearchClient,
    sentencePlanClient,
    deliusClient,
    interventionsClient,
    oasysClient,
    prisonApiClient,
  } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const deliusService = new DeliusService(deliusClient)

  return {
    userService,
    deliusService,
    sentencePlanClient,
    probationSearchClient,
    interventionsClient,
    oasysClient,
    prisonApiClient,
  }
}

export type Services = ReturnType<typeof services>

export { UserService, SentencePlanClient, ProbationSearchClient, DeliusService }
