import IndexPage from '../pages/index'
import Page from '../pages/page'
import SearchPage from '../pages/search'
import CasePage from '../pages/case'

context('Case', () => {
  let page: CasePage

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubProbationSearch')
    cy.task('stubDeliusIntegration')
    cy.task('stubSentencePlanApi')
    cy.task('stubPrisonApiIntegration')
    cy.signIn()
  })

  context('Show custody start date', () => {
    beforeEach(() => {
      Page.verifyOnPage(IndexPage).startButton().click()
      Page.verifyOnPage(SearchPage).search().selectFirstResult()
      page = Page.verifyOnPage(CasePage)
    })

    it('displays case details banner', () => page.checkCaseDetails())

    it('show custody start date', () => {
      cy.get('[data-qa=arrival-into-custody-date]').should('contain.text', '03/02/2010')
    })
  })
})
