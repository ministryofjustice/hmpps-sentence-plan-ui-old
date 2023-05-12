export type PageElement = Cypress.Chainable<JQuery>

export default abstract class Page {
  static verifyOnPage<T>(constructor: new () => T): T {
    return new constructor()
  }

  constructor(private readonly title: string) {
    this.checkOnPage()
  }

  checkOnPage(): void {
    cy.get('title, h1').contains(this.title)
  }

  signOut = (): PageElement => cy.get('[data-qa=signOut]')

  manageDetails = (): PageElement => cy.get('[data-qa=manageDetails]')

  checkCaseDetails = () => {
    cy.get('[data-qa=crn]').should('contain.text', 'X000001')
    cy.get('[data-qa=noms-number]').should('not.exist')
    cy.get('[data-qa=tier]').should('contain.text', 'Tier: D2')
    cy.get('[data-qa=dob]').should('contain.text', 'Date of birth: 01/01/1980')
    cy.get('[data-qa=manager]').should('contain.text', 'Manager: Unallocated')
    cy.get('[data-qa=region]').should('contain.text', 'Region: London')
  }
}
