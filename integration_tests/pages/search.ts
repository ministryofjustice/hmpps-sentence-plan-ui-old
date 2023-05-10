import Page from './page'

export default class SearchPage extends Page {
  constructor() {
    super('Search for a person')
  }

  search = (text = 'testing') => {
    cy.get('#search').type(text)
    this.searchButton().click()
    return this
  }

  selectFirstResult = () => {
    this.results().first().find('a').click()
    return this
  }

  selectSecondResult = () => {
    this.results().first().next().find('a').click()
    return this
  }

  searchButton = () => cy.get('button').contains('Search')

  pageNumber = () => cy.get('.govuk-pagination__item--current')

  resultSummary = () => cy.get('[data-qa=result-summary]')

  results = () => cy.get('tbody tr')
}
