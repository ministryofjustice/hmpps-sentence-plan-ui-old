import fs from 'fs'
import { stubFor } from './wiremock'

const json = JSON.parse(fs.readFileSync('wiremock/mappings/probation-search-api.json').toString())

export default {
  stubProbationSearch: () => Promise.all(json.mappings.map(stubFor)),
  stubPaginatedSearchResults: () =>
    stubFor({
      request: {
        method: 'POST',
        urlPattern: '/probation-search/phrase.*',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: {
          totalElements: 86,
          totalPages: 8,
          size: 10,
          content: Array.from({ length: 10 }).map((_, i) => ({
            firstName: 'Search',
            surname: 'Result',
            otherIds: { crn: i },
          })),
        },
      },
    }),
}
