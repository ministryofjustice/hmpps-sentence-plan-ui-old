import Page from '../pages/page'
import ReviewAndStartPlan from '../pages/reviewAndStartPlan'
import ConfirmStartPlan from '../pages/confirmStartPlan'
import CasePage from '../pages/case'

context('confirm start plan', () => {
  let reviewStartPlan: ReviewAndStartPlan
  let confirmStartPlan: ConfirmStartPlan
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
    cy.visit('/sentence-plan/00000000-0000-0000-0000-000000000001/view-plan')
  })

  it('Verify start plan page', () => {
    reviewStartPlan = Page.verifyOnPage(ReviewAndStartPlan)
    reviewStartPlan.startPlanButton().should('be.visible')
    reviewStartPlan.startPlanButton().click()
    cy.url().should('contain', '/confirmStart')
    confirmStartPlan = Page.verifyOnPage(ConfirmStartPlan)
    confirmStartPlan.confirmStartPlanButton().click()
    Page.verifyOnPage(CasePage)
  })
})
