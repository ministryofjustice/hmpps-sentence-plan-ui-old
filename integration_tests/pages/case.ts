import Page from './page'

export default class CasePage extends Page {
  constructor() {
    super('Sentence plans')
  }

  checkOnPage(): void {
    cy.get('title').contains('Sentence plans')
  }

  addAnotherButton = () => cy.get('[data-qa=add-another]')

  createButton = () => cy.get('[data-qa=create]')

  sentencePlans = () => cy.get('tbody tr')
}
