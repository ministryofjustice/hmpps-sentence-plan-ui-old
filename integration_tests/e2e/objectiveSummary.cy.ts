import Page from '../pages/page'
import ActionPage from '../pages/action'
import ObjectiveSummaryPage from '../pages/objectiveSummary'

context('Objective summary', () => {
  let page: ObjectiveSummaryPage

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
    cy.visit(
      '/sentence-plan/00000000-0000-0000-0000-000000000003/objective/00000000-0000-0000-0000-000000000000/add-action',
    )
    Page.verifyOnPage(ActionPage).enterDetails()
    page = Page.verifyOnPage(ObjectiveSummaryPage)
  })

  it('displays case details banner', () => {
    page.checkCaseDetails()
    cy.get('[data-qa="objective"]').should('contain', 'Test objective')
  })

  it('displays details', () => {
    page.objectiveOverview().should('contain', 'Test objective')
    page.objectiveOverview().should('contain', 'Accommodation')
    page.objectiveOverview().should('contain', 'Education, training and employment')
    page.objectiveOverview().should('contain', 'Action')
    page.actionDetails(1).should('contain', 'Do a thing')
    page.actionDetails(2).should('contain', 'Do another thing')
    page.actionDetails(2).should('contain', 'Some intervention')
  })

  it('can change objective details', () => {
    cy.get('[data-qa=change-objective]').click()
    cy.url().should('match', /\/objective\/00000000-0000-0000-0000-000000000000$/)
  })

  it('can change action details', () => {
    cy.get('[data-qa=change-action-1]').click()
    cy.url().should(
      'match',
      /\/objective\/00000000-0000-0000-0000-000000000000\/action\/00000000-0000-0000-0000-000000000000$/,
    )
  })

  it('can delete action details', () => {
    cy.get('[data-qa=delete-action-2]').click()
    cy.url().should('contain', 'objective/00000000-0000-0000-0000-000000000000/summary')
  })

  it('can delete objective', () => {
    cy.get('[data-qa=delete-objective]').click()
    cy.url().should('contain', 'objective/00000000-0000-0000-0000-000000000000/confirmDelete')
    cy.get('[data-qa=delete-objective-button]').click()
    cy.url().should('contain', '/sentence-plan/00000000-0000-0000-0000-000000000003/summary')
  })
})
