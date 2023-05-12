import IndexPage from '../pages/index'
import Page from '../pages/page'
import SearchPage from '../pages/search'
import CasePage from '../pages/case'
import SummaryPage from '../pages/summary'

context('Sentence plan summary', () => {
  let page: SummaryPage

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubProbationSearch')
    cy.task('stubDeliusIntegration')
    cy.task('stubSentencePlanApi')
    cy.signIn()
  })

  beforeEach(() => {
    Page.verifyOnPage(IndexPage).startButton().click()
    Page.verifyOnPage(SearchPage).search().selectFirstResult()
    Page.verifyOnPage(CasePage).addAnotherButton().click()
    page = Page.verifyOnPage(SummaryPage)
  })

  it('displays case details banner', () => page.checkCaseDetails())

  it('displays engagement and compliance link', () => {
    page.engagementAndCompliance().should('exist').should('have.attr', 'href', './engagement-and-compliance')
  })
})
