import IndexPage from '../pages/index'
import Page from '../pages/page'
import SearchPage from '../pages/search'

context('Start page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.signIn()
  })

  it('navigates to search page when clicking start', () => {
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.startButton().should('be.visible').click()
    Page.verifyOnPage(SearchPage)
  })
})
