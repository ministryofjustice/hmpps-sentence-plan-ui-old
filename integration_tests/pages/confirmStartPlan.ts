import Page from './page'

export default class ConfirmStartPlan extends Page {
  constructor() {
    super('Confirm Start Sentence Plan')
  }

  confirmStartPlanButton = () => cy.get('button[name="confirm-start-plan"]')
}
