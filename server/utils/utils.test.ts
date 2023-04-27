import { convertToTitleCase, initialiseName, pagination } from './utils'

describe('convert to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe('pagination', () => {
  it.each([
    { currentPage: 1, totalPages: 1, maxPagesToShow: 7, expected: [1] },
    { currentPage: 2, totalPages: 3, maxPagesToShow: 7, expected: [1, 2, 3] },
    { currentPage: 3, totalPages: 10, maxPagesToShow: 7, expected: [1, 2, 3, 4, 5, 6, '...'] },
    { currentPage: 4, totalPages: 10, maxPagesToShow: 5, expected: ['...', 2, 3, 4, 5, 6, '...'] },
    { currentPage: 5, totalPages: 5, maxPagesToShow: 2, expected: ['...', 4, 5] },
    { currentPage: 1, totalPages: 5, maxPagesToShow: 2, expected: [1, 2, '...'] },
  ])('pagination items: %s', ({ currentPage, totalPages, maxPagesToShow, expected }) => {
    const paginationItems = pagination(currentPage, totalPages, 100, () => '', maxPagesToShow).items
    const pageNumbers = paginationItems.map(item => ('ellipsis' in item ? '...' : item.number))
    expect(pageNumbers).toEqual(expected)
  })
})
