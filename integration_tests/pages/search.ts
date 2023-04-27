import Page from './page'

export default class SearchPage extends Page {
  constructor() {
    super('Who is this sentence plan for?')
  }

  searchButton = () => cy.get('button').contains('Search')

  pageNumber = () => cy.get('.govuk-pagination__item--current')

  resultSummary = () => cy.get('[data-qa=result-summary]')

  results = () => cy.get('tbody tr')
}
