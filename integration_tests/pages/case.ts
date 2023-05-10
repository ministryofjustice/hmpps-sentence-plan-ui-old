import Page from './page'

export default class CasePage extends Page {
  constructor() {
    super('Case summary')
  }

  addAnotherButton = () => cy.get('[data-qa=add-another]')

  createButton = () => cy.get('[data-qa=create]')

  sentencePlans = () => cy.get('tbody tr')
}
