import fs from 'fs'
import { stubFor } from './wiremock'

const json = JSON.parse(fs.readFileSync('wiremock/mappings/probation-search.json').toString())

export default {
  stubProbationSearch: () => Promise.all(json.mappings.map(stubFor)),
}
