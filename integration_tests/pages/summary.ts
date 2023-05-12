import Page from './page'

export default class SummaryPage extends Page {
  constructor() {
    super('Create a sentence plan')
  }

  engagementAndCompliance = () => cy.get('.moj-task-list__item').contains('Engagement and compliance')
}
