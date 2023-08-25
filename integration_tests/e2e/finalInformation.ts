import Page from '../pages/page'
import SummaryPage from '../pages/summary'

context('Final information', () => {
  let page: SummaryPage

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubDeliusIntegration')
    cy.task('stubSentencePlanApi')
    cy.signIn()
  })

  beforeEach(() => {
    cy.visit('/sentence-plan/00000000-0000-0000-0000-000000000003/summary')
    page = Page.verifyOnPage(SummaryPage)
  })

  it('your decisions can be entered', () => {
    page.yourDecisions().click()
    page.checkCaseDetails()
    cy.get('#practitioner-comments').type('Test data for practitioner comments')
    cy.get('form').submit()
    cy.url().should('contain', '/summary')
  })

  it("individual's comments can be entered", () => {
    page.individualsComments().click()
    page.checkCaseDetails()
    cy.get('#individual-comments').type('Test data for individual comments')
    cy.get('form').submit()
    cy.url().should('contain', '/summary')
  })
})
