import Page from '../pages/page'
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
    cy.task('stubOasysIntegration')
    cy.task('stubSentencePlanApi')
    cy.task('stubInterventionApi')
    cy.signIn()
  })

  beforeEach(() => {
    cy.visit('/sentence-plan/00000000-0000-0000-0000-000000000003/summary')
    Page.verifyOnPage(SummaryPage).addObjectiveButton().click()
    Page.verifyOnPage(ObjectivePage).enterDetails()
    page = Page.verifyOnPage(ActionPage)
  })

  it('displays case details banner', () => {
    page.checkCaseDetails()
    cy.get('[data-qa="objective"]').should('contain', 'Test objective')
  })

  it('navigates to action summary page on save', () => page.enterDetails())

  it('auto-completes national interventions', () => {
    cy.get('#description').type('Test action description')
    cy.get('[name=relates-to-intervention]').check('yes')
    cy.get('[name=intervention-type]').check('national')
    cy.get('[name=national-intervention-name]').type('personal wellbeing{downArrow}{enter}')
    cy.get('[name=national-intervention-name]').should(
      'have.value',
      'Personal Wellbeing Services for Young Adults in Dyfed-Powys DA',
    )
    cy.get('button[name=continue]').click()
    cy.url().should('contain', '/summary')
  })

  it('can add another action', () => {
    cy.get('#description').type('Test objective description')
    cy.get('[name=relates-to-intervention]').check('no')
    cy.get('button[name=add-another]').click()
    cy.url().should('contain', '/add-action')
  })
})
