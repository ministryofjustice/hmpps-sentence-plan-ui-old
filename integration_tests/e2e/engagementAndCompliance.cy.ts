import Page from '../pages/page'
import SummaryPage from '../pages/summary'
import EngagementAndCompliancePage from '../pages/engagementAndCompliance'

context('Engagement and compliance', () => {
  let page: EngagementAndCompliancePage

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
    cy.visit('/sentence-plan/00000000-0000-0000-0000-000000000003/summary')
    Page.verifyOnPage(SummaryPage).engagementAndCompliance().click()
    page = Page.verifyOnPage(EngagementAndCompliancePage)
  })

  it('displays case details banner', () => page.checkCaseDetails())

  it('data can be entered', () => {
    cy.get('#risk-factors').type('Test data for risk factors')
    cy.get('#positive-factors').type('Test data for positive factors')
    cy.get('form').submit()
    cy.url().should('contain', '/summary')
  })
})
