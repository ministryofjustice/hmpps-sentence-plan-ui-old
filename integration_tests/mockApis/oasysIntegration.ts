import fs from 'fs'
import { stubAll } from './wiremock'

const json = JSON.parse(fs.readFileSync('wiremock/mappings/oasys-integration.json').toString())

export default {
  stubOasysIntegration: () => stubAll(json),
}
