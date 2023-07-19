import Page from '../pages/page'
import SummaryPage from '../pages/summary'
import ReviewAndStartPlan from '../pages/reviewAndStartPlan'

context('Review and start plan', () => {
  let summaryPage: SummaryPage
  let reviewStartPlan: ReviewAndStartPlan
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
    cy.visit('/sentence-plan/00000000-0000-0000-0000-000000000001/summary')
  })

  it('Verify review page', () => {
    summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.startPlanLink().click()
    reviewStartPlan = Page.verifyOnPage(ReviewAndStartPlan)
    reviewStartPlan.startPlanButton().should('be.visible')
    cy.get('form').should('contain.text', 'About the individual')
    cy.get('form').should('contain.text', 'Objective 1')
    cy.get('form').should('contain.text', 'Objective 2')
    cy.get('form').should('contain.text', 'Objective 3')
    cy.get('form').should('contain.text', 'Final information.')
    cy.get('form').submit()
    cy.url().should('contain', '/confirmStart')
  })
})
