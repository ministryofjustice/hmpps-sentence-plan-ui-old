import IndexPage from '../pages/index'
import Page from '../pages/page'
import SearchPage from '../pages/search'
import CasePage from '../pages/case'

context('Case', () => {
  let page: CasePage

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubProbationSearch')
    cy.task('stubDeliusIntegration')
    cy.task('stubSentencePlanApi')
    cy.signIn()
  })

  context('existing', () => {
    beforeEach(() => {
      Page.verifyOnPage(IndexPage).startButton().click()
      Page.verifyOnPage(SearchPage).search().selectFirstResult()
      page = Page.verifyOnPage(CasePage)
    })

    it('displays case details banner', () => {
      cy.get('[data-qa=crn]').should('contain.text', 'X000001')
      cy.get('[data-qa=noms-number]').should('not.exist')
      cy.get('[data-qa=tier]').should('contain.text', 'Tier: D2')
      cy.get('[data-qa=dob]').should('contain.text', 'Date of birth: 01/01/1980')
      cy.get('[data-qa=manager]').should('contain.text', 'Manager: Unallocated')
      cy.get('[data-qa=region]').should('contain.text', 'Region: London')
    })

    it('lists existing sentence plans', () => {
      page.sentencePlans().should('have.length', 2)
      page.addAnotherButton().should('contain.text', 'Add another')
      page.createButton().should('not.exist')
    })
  })

  context('new', () => {
    beforeEach(() => {
      Page.verifyOnPage(IndexPage).startButton().click()
      Page.verifyOnPage(SearchPage).search().selectSecondResult()
      page = Page.verifyOnPage(CasePage)
    })

    it('displays case details banner', () => {
      cy.get('[data-qa=crn]').should('contain.text', 'X000002')
      cy.get('[data-qa=noms-number]').should('contain.text', 'AB1234C')
      cy.get('[data-qa=tier]').should('contain.text', 'Tier: B1')
      cy.get('[data-qa=dob]').should('contain.text', 'Date of birth: 01/02/1993')
      cy.get('[data-qa=manager]').should('contain.text', 'Manager: John Smith')
      cy.get('[data-qa=region]').should('contain.text', 'Region: Wales')
    })

    it('display create button when there are no existing sentence plans', () => {
      page.sentencePlans().should('not.exist')
      page.addAnotherButton().should('not.exist')
      page.createButton().should('contain.text', 'Create a sentence plan')
    })
  })
})
