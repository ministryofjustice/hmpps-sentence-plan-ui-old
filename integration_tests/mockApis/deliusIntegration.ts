import fs from 'fs'
import { stubAll } from './wiremock'

const json = JSON.parse(fs.readFileSync('wiremock/mappings/delius-integration.json').toString())

export default {
  stubDeliusIntegration: () => stubAll(json),
}
