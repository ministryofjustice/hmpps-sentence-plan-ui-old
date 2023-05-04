import fs from 'fs'
import { stubAll } from './wiremock'

const json = JSON.parse(fs.readFileSync('wiremock/mappings/sentence-plan-api.json').toString())

export default {
  stubSentencePlanApi: () => stubAll(json),
}
