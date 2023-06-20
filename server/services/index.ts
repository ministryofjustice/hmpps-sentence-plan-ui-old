import { dataAccess } from '../data'
import UserService from './userService'
import ProbationSearchClient from '../data/probationSearchClient'
import SentencePlanClient from '../data/sentencePlanClient'
import DeliusService from './deliusService'

export const services = () => {
  const { hmppsAuthClient, probationSearchClient, sentencePlanClient, deliusClient, interventionsClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const deliusService = new DeliusService(deliusClient)

  return {
    userService,
    deliusService,
    sentencePlanClient,
    probationSearchClient,
    interventionsClient,
  }
}

export type Services = ReturnType<typeof services>

export { UserService, SentencePlanClient, ProbationSearchClient, DeliusService }
