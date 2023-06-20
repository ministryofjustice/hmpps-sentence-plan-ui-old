import IndexPage from '../pages/index'
import Page from '../pages/page'
import SearchPage from '../pages/search'
import CasePage from '../pages/case'
import SummaryPage from '../pages/summary'
import ObjectivePage from '../pages/objective'
import ActionPage from '../pages/action'

context('Action', () => {
  let page: ActionPage

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubProbationSearch')
    cy.task('stubDeliusIntegration')
    cy.task('stubSentencePlanApi')
    cy.task('stubInterventionApi')
    cy.signIn()
  })

  beforeEach(() => {
    Page.verifyOnPage(IndexPage).startButton().click()
    Page.verifyOnPage(SearchPage).search().selectFirstResult()
    Page.verifyOnPage(CasePage).createButton().click()
    Page.verifyOnPage(SummaryPage).addObjectiveButton().click()
    Page.verifyOnPage(ObjectivePage).enterObjective()
    page = Page.verifyOnPage(ActionPage)
  })

  it('displays case details banner', () => {
    page.checkCaseDetails()
    cy.get('[data-qa="objective"]').should('contain', 'Test objective')
  })

  it('auto-completes national interventions', () => {
    cy.get('#description').type('Test objective description')
    cy.get('[name=relates-to-intervention]').check('yes')
    cy.get('[name=intervention-type]').check('national')
    cy.get('[name=national-intervention-name]').type('personal wellbeing{downArrow}{enter}')
    cy.get('[name=national-intervention-name]').should(
      'have.value',
      'Personal Wellbeing Services for Young Adults in Dyfed-Powys DA',
    )
    cy.get('button[name=continue]').click()
    cy.url().should('contain', '/action-summary')
  })

  it('navigates to action summary page on save', () => {
    cy.get('#description').type('Test objective description')
    cy.get('[name=relates-to-intervention]').check('yes')
    cy.get('[name=intervention-type]').check('other')
    cy.get('[name=other-intervention-name]').type('Some other intervention')
    cy.get('button[name=continue]').click()
    cy.url().should('contain', '/action-summary')
  })

  it('can add another action', () => {
    cy.get('#description').type('Test objective description')
    cy.get('[name=relates-to-intervention]').check('no')
    cy.get('button[name=add-another]').click()
    cy.url().should('contain', '/add-action')
  })
})
