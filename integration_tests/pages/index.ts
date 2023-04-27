import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('Manage a Sentence Plan')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  startButton = () => cy.get('a').contains('Start now')
}
