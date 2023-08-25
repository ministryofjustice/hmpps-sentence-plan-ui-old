import { dataAccess } from '../data'
import HmppsAuthClient from '../data/hmppsAuthClient'
import UserService from './userService'
import SentencePlanClient from '../data/sentencePlanClient'
import DeliusService from './deliusService'

export const services = () => {
  const { hmppsAuthClient, sentencePlanClient, deliusClient, interventionsClient, oasysClient, prisonApiClient } =
    dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const deliusService = new DeliusService(deliusClient)

  return {
    hmppsAuthClient,
    userService,
    deliusService,
    sentencePlanClient,
    interventionsClient,
    oasysClient,
    prisonApiClient,
  }
}

export type Services = ReturnType<typeof services>

export { HmppsAuthClient, UserService, SentencePlanClient, DeliusService }
