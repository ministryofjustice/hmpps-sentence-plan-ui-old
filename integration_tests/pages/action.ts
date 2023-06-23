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
    cy.get('button[name=continue]').click()
    cy.url().should('contain', '/summary')
  }
}
