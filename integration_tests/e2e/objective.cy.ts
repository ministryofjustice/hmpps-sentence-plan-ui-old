import IndexPage from '../pages/index'
import Page from '../pages/page'
import SearchPage from '../pages/search'
import CasePage from '../pages/case'
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
    cy.signIn()
  })

  beforeEach(() => {
    Page.verifyOnPage(IndexPage).startButton().click()
    Page.verifyOnPage(SearchPage).search().selectFirstResult()
    Page.verifyOnPage(CasePage).createButton().click()
    Page.verifyOnPage(SummaryPage).addObjectiveButton().click()
    page = Page.verifyOnPage(ObjectivePage)
  })

  it('displays case details banner', () => page.checkCaseDetails())

  it('data can be entered', () => {
    cy.get('#description').type('Test objective description')
    cy.get('#relates-to-needs').check('yes')
    cy.get('[name=needs]').check('accommodation')
    cy.get('[name=needs]').check('attitudes')
    cy.get('[name=motivation]').check('Pre-contemplation')
    cy.get('form').submit()
    cy.url().should('contain', '/summary')
  })
})
