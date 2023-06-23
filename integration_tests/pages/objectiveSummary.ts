import Page from './page'

export default class ObjectiveSummaryPage extends Page {
  constructor() {
    super('Objective summary')
  }

  objectiveOverview = () => cy.get('.govuk-summary-card').first()

  actionDetails = (number: number) => cy.get('.govuk-summary-card').eq(number)
}
