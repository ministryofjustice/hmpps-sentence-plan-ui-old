import Page from '../pages/page'
import SummaryPage from '../pages/summary'
import ObjectivePage from '../pages/objective'

context('Objective', () => {
  let page: ObjectivePage

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
    Page.verifyOnPage(SummaryPage).addObjectiveButton().click()
    page = Page.verifyOnPage(ObjectivePage)
  })

  it('displays case details banner', () => page.checkCaseDetails())

  it('data can be entered', () => {
    cy.get('#description').type('Test objective description')
    cy.get('#relates-to-needs').check('yes')
    cy.get('[name=needs\\[\\]]').check('accommodation')
    cy.get('[name=needs\\[\\]]').check('attitudes')
    cy.get('[name=motivation]').check('Pre-contemplation')
    cy.get('[name=status]').check('in-progress')
    cy.get('form').submit()
    cy.url().should('contain', '/add-action')
  })
})
