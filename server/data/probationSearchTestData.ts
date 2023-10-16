import { ProbationSearchResult } from '@ministryofjustice/probation-search-frontend/data/probationSearchClient'

const probationSearchTestData: ProbationSearchResult[] = [
  {
    firstName: 'Joe',
    surname: 'Bloggs',
    dateOfBirth: '1980-01-01',
    age: 43,
    gender: 'Male',
    offenderId: 1,
    otherIds: { crn: 'X000001' },
    highlight: {},
  },
  {
    firstName: 'Jane',
    surname: 'Bloggs',
    dateOfBirth: '1993-02-01',
    age: 30,
    gender: 'Female',
    offenderId: 2,
    otherIds: { crn: 'X000002' },
    highlight: {},
  },
]

export default probationSearchTestData
