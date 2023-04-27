import IndexPage from '../pages/index'
import Page from '../pages/page'
import SearchPage from '../pages/search'

context('Search', () => {
  let page: SearchPage

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubProbationSearch')
    cy.signIn()
    Page.verifyOnPage(IndexPage).startButton().click()
    page = Page.verifyOnPage(SearchPage)
  })

  it('displays an error for an empty query', () => {
    page.searchButton().click()

    cy.get('#search-error').should('contain.text', 'Please enter a search term')
  })

  it('displays the first page of results', () => {
    cy.get('#search').type('joe bloggs')
    page.searchButton().click()

    page.pageNumber().should('contain.text', '1')
    page.resultSummary().should('contain.text', 'Showing 1 to 10 of 64 results')
    page
      .results()
      .should('have.length', 10)
      .first()
      .should('contain.text', 'X469869')
      .should('contain.text', 'Joe Bloggs')
      .should('contain.text', '1980-01-01')
  })

  it('can navigate to the next page', () => {
    cy.get('#search').type('joe bloggs')
    page.searchButton().click()

    cy.get('a[rel=next]').click()

    page.pageNumber().should('contain.text', '2')
    page.resultSummary().should('contain.text', 'Showing 11 to 20 of 64 results')
    page
      .results()
      .should('have.length', 10)
      .first()
      .should('contain.text', 'X055106')
      .should('contain.text', 'Joe Bloggs')
      .should('contain.text', '1993-02-01')
  })

  it('navigates to sentence plans when selecting a result', () => {
    cy.get('#search').type('joe bloggs')
    page.searchButton().click()

    page.results().first().find('a').click()

    cy.url().should('contain', '/sentence-plans/X469869')
  })
})
