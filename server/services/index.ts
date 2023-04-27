import { dataAccess } from '../data'
import UserService from './userService'
import ProbationSearchClient from '../data/probationSearchClient'

export const services = () => {
  const { hmppsAuthClient, probationSearchClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)

  return {
    userService,
    probationSearchClient,
  }
}

export type Services = ReturnType<typeof services>

export { UserService, ProbationSearchClient }
