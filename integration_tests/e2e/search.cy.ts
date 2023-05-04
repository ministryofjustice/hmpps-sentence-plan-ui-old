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

  it('displays results', () => {
    page.search()

    page.pageNumber().should('not.exist')
    page.resultSummary().should('contain.text', 'Showing 1 to 2 of 2 results')
    page
      .results()
      .should('have.length', 2)
      .first()
      .should('contain.text', 'X000001')
      .should('contain.text', 'Joe Bloggs')
      .should('contain.text', '01/01/1980')
      .next()
      .should('contain.text', 'X000002')
      .should('contain.text', 'Jane Bloggs')
      .should('contain.text', '01/02/1993')
  })

  it('navigates to case when selecting a result', () => {
    page.search()

    page.results().first().find('a').click()

    cy.url().should('contain', '/case/X000001')
  })
})

context('Pagination', () => {
  let page: SearchPage

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubPaginatedSearchResults')
    cy.signIn()
    Page.verifyOnPage(IndexPage).startButton().click()
    page = Page.verifyOnPage(SearchPage)
  })

  it('displays the first page of results', () => {
    page.search()

    page.pageNumber().should('contain.text', '1')
    page.resultSummary().should('contain.text', 'Showing 1 to 10 of 86 results')
    page.results().should('have.length', 10)
  })

  it('can navigate to the next page', () => {
    page.search()

    cy.get('a[rel=next]').click()

    page.pageNumber().should('contain.text', '2')
    page.resultSummary().should('contain.text', 'Showing 11 to 20 of 86 results')
    page.results().should('have.length', 10)
  })
})
