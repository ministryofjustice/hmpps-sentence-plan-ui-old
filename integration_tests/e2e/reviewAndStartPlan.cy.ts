import IndexPage from '../pages/index'
import Page from '../pages/page'
import SearchPage from '../pages/search'
import CasePage from '../pages/case'
import SummaryPage from '../pages/summary'
import ReviewAndStartPlan from '../pages/reviewAndStartPlan'
import ObjectivePage from '../pages/objective'

context('Review and start plan', () => {
  let page: ReviewAndStartPlan

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
    Page.verifyOnPage(SummaryPage).startPlanLink().click()
    Page.verifyOnPage(ReviewAndStartPlan)
  })

  it('displays start plan button', () =>
    cy.get('[data-qa="confirm-start-sentence-plan"]').should('contain', 'Start Plan'))
})
