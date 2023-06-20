import fs from 'fs'
import { stubAll } from './wiremock'

const json = JSON.parse(fs.readFileSync('wiremock/mappings/interventions-api.json').toString())

export default {
  stubInterventionApi: () => stubAll(json),
}
