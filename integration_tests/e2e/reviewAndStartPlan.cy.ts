import Page from '../pages/page'
import SummaryPage from '../pages/summary'

context('Review and start plan', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubProbationSearch')
    cy.task('stubDeliusIntegration')
    cy.task('stubSentencePlanApi')
    cy.task('stubOasysIntegration')
    cy.signIn()
  })

  beforeEach(() => {
    cy.visit('/sentence-plan/00000000-0000-0000-0000-000000000003/summary')
  })

  it('Verify on Summary page', () => {
    Page.verifyOnPage(SummaryPage)
  })
})
