import IndexPage from '../pages/index'
import Page from '../pages/page'
import SearchPage from '../pages/search'

context('Search', () => {
  let page: SearchPage

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
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
    page
      .results()
      .should('have.length', 2)
      .first()
      .should('contain.text', 'X000001')
      .should('contain.text', 'Joe')
      .should('contain.text', '01/01/1980')
      .next()
      .should('contain.text', 'X000002')
      .should('contain.text', 'Jane')
      .should('contain.text', '01/02/1993')
  })

  it('navigates to case when selecting a result', () => {
    page.search()

    page.results().first().find('a').click()

    cy.url().should('contain', '/case/X000001')
  })
})
