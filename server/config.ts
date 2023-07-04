const production = process.env.NODE_ENV === 'production'

function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

export class AgentConfig {
  timeout: number

  constructor(timeout = 8000) {
    this.timeout = timeout
  }
}

export interface ApiConfig {
  url: string
  timeout: {
    response: number
    deadline: number
  }
  agent: AgentConfig
}

export default {
  production,
  https: production,
  staticResourceCacheDuration: '1h',
  redis: {
    host: get('REDIS_HOST', 'localhost', requiredInProduction),
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
  },
  session: {
    secret: get('SESSION_SECRET', 'app-insecure-default-session', requiredInProduction),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)),
  },
  apis: {
    hmppsAuth: {
      url: get('HMPPS_AUTH_URL', 'http://localhost:9090/auth', requiredInProduction),
      externalUrl: get('HMPPS_AUTH_EXTERNAL_URL', get('HMPPS_AUTH_URL', 'http://localhost:9090/auth')),
      timeout: {
        response: Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('HMPPS_AUTH_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000))),
      apiClientId: get('API_CLIENT_ID', 'sentence-plan-client', requiredInProduction),
      apiClientSecret: get('API_CLIENT_SECRET', 'sentence-plan-client', requiredInProduction),
      systemClientId: get('SYSTEM_CLIENT_ID', 'sentence-plan-api-client', requiredInProduction),
      systemClientSecret: get('SYSTEM_CLIENT_SECRET', 'sentence-plan-api-client', requiredInProduction),
    },
    tokenVerification: {
      url: get('TOKEN_VERIFICATION_API_URL', 'http://localhost:8100', requiredInProduction),
      timeout: {
        response: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000))),
      enabled: get('TOKEN_VERIFICATION_ENABLED', 'false') === 'true',
    },
    sentencePlan: {
      url: get('SENTENCE_PLAN_API_URL', 'http://localhost:8081/sentence-plan-api', requiredInProduction),
      timeout: {
        response: Number(get('SENTENCE_PLAN_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('SENTENCE_PLAN_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('SENTENCE_PLAN_API_TIMEOUT_RESPONSE', 5000))),
    },
    probationSearch: {
      url: get('PROBATION_SEARCH_API_URL', 'http://localhost:8081/probation-search', requiredInProduction),
      timeout: {
        response: Number(get('PROBATION_SEARCH_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('PROBATION_SEARCH_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('PROBATION_SEARCH_API_TIMEOUT_RESPONSE', 5000))),
    },
    delius: {
      url: get('DELIUS_INTEGRATION_API_URL', 'http://localhost:8081/delius', requiredInProduction),
      timeout: {
        response: Number(get('DELIUS_INTEGRATION_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('DELIUS_INTEGRATION_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('DELIUS_INTEGRATION_API_TIMEOUT_RESPONSE', 5000))),
    },
    oasys: {
      url: get('OASYS_INTEGRATION_API_URL', 'http://localhost:8081/oasys', requiredInProduction),
      timeout: {
        response: Number(get('OASYS_INTEGRATION_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('OASYS_INTEGRATION_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('OASYS_INTEGRATION_API_TIMEOUT_RESPONSE', 5000))),
    },
    interventions: {
      url: get('INTERVENTIONS_API_URL', 'http://localhost:8081/interventions-api', requiredInProduction),
      timeout: {
        response: Number(get('INTERVENTIONS_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('INTERVENTIONS_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('INTERVENTIONS_API_TIMEOUT_RESPONSE', 5000))),
    },
    prisonApi: {
      url: get('PRISON_API_URL', 'http://localhost:8081/prison-api', requiredInProduction),
      timeout: {
        response: Number(get('PRISON_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('PRISON_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('PRISON_API_TIMEOUT_RESPONSE', 5000))),
    },
  },
  domain: get('INGRESS_URL', 'http://localhost:3000', requiredInProduction),
}
