import Page from './page'

export default class ObjectivePage extends Page {
  constructor() {
    super('Set an objective')
  }

  enterDetails() {
    cy.get('#description').type('Test objective')
    cy.get('#relates-to-needs').check('yes')
    cy.get('[name=needs\\[\\]]').check('relationships')
    cy.get('[name=motivation]').check('Action')
    cy.get('form').submit()
    cy.url().should('contain', '/add-action')
  }
}
