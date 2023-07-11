import Page from './page'

export default class ActionPage extends Page {
  constructor() {
    super('Add an action')
  }

  enterDetails() {
    cy.get('#description').type('Test action description')
    cy.get('[name=relates-to-intervention]').check('yes')
    cy.get('[name=intervention-type]').check('other')
    cy.get('[name=other-intervention-name]').type('Some other intervention')
    cy.get('#target-date-month').type('12')
    cy.get('#target-date-year').type('2100')
    cy.get('[name=owner]').check('individual')
    cy.get('[name=other]').check('other')
    cy.get('[name=other]').check('other')
    cy.get('[name=other-owner]').type('Someone else')
    cy.get('[name=status]').check('to-do')
    return this
  }

  continue() {
    cy.get('button[name=continue]').click()
    cy.url().should('contain', '/summary')
  }
}
