/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { buildAppInsightsClient, initialiseAppInsights } from '../utils/azureAppInsights'
import HmppsAuthClient from './hmppsAuthClient'
import { createRedisClient } from './redisClient'
import TokenStore from './tokenStore'
import ProbationSearchClient from './probationSearchClient'
import SentencePlanClient from './sentencePlanClient'
import DeliusClient from './deliusClient'
import InterventionsClient from './interventionsClient'
import OasysClient from './oasysClient'
import PrisonApiClient from './prisonApiClient'

initialiseAppInsights()
buildAppInsightsClient()

export const dataAccess = () => {
  const hmppsAuthClient = new HmppsAuthClient(new TokenStore(createRedisClient()))
  return {
    hmppsAuthClient,
    sentencePlanClient: new SentencePlanClient(hmppsAuthClient),
    probationSearchClient: new ProbationSearchClient(hmppsAuthClient),
    deliusClient: new DeliusClient(hmppsAuthClient),
    interventionsClient: new InterventionsClient(hmppsAuthClient),
    oasysClient: new OasysClient(hmppsAuthClient),
    prisonApiClient: new PrisonApiClient(hmppsAuthClient),
  }
}

export type DataAccess = ReturnType<typeof dataAccess>

export { HmppsAuthClient, ProbationSearchClient, SentencePlanClient, DeliusClient }
