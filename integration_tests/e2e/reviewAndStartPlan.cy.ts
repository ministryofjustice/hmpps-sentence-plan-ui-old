import Page from '../pages/page'
import SummaryPage from '../pages/summary'
import ReviewAndStartPlan from '../pages/reviewAndStartPlan'

context('Review and start plan', () => {
  let summaryPage: SummaryPage
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
    // summaryPage = Page.verifyOnPage(SummaryPage)
    // summaryPage.startPlanLink().click()
    Page.verifyOnPage(ReviewAndStartPlan)
  })

  it('displays start plan button', () => {
    summaryPage = Page.verifyOnPage(SummaryPage)
    // cy.get('[data-qa="confirm-start-sentence-plan"]').should('contain', 'Start Plan')
  })
})
