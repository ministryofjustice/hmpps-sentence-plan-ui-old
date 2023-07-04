import fs from 'fs'
import { stubAll } from './wiremock'

const json = JSON.parse(fs.readFileSync('wiremock/mappings/prison-api.json').toString())

export default {
  stubPrisonApiIntegration: () => stubAll(json),
}
