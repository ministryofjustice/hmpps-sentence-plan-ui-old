import Page from './page'

export default class ReviewAndStartPlan extends Page {
  constructor() {
    super('Review and Start Plan')
  }

  startPlanButton = () => cy.get('button[name="start-plan"]')
}
