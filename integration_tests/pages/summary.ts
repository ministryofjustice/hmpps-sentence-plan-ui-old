import Page from './page'

export default class SummaryPage extends Page {
  constructor() {
    super('Create a sentence plan')
  }

  engagementAndCompliance = () => cy.get('.moj-task-list__item').contains('Engagement and compliance')

  yourDecisions = () => cy.get('.moj-task-list__item').contains('Your decisions')

  individualsComments = () => cy.get('.moj-task-list__item').contains("Individual's comments")

  addObjectiveButton = () => cy.get('[data-qa=add-objective]')

  startPlanLink = () => cy.get('[data-qa=review-start-plan] > a')
}
