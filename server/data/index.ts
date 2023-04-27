/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'

initialiseAppInsights()
buildAppInsightsClient()

import HmppsAuthClient from './hmppsAuthClient'
import { createRedisClient } from './redisClient'
import TokenStore from './tokenStore'
import ProbationSearchClient from './probationSearchClient'

type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => {
  const hmppsAuthClient = new HmppsAuthClient(new TokenStore(createRedisClient()))
  return {
    hmppsAuthClient,
    probationSearchClient: new ProbationSearchClient(hmppsAuthClient),
  }
}

export type DataAccess = ReturnType<typeof dataAccess>

export { HmppsAuthClient, RestClientBuilder }
