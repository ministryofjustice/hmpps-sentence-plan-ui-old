export default (summaryPage: string, analysisCompletePage: string, positionNumber: number) => {
  const question = 'Are there any patterns of behaviours related to this area?'
  const summaryQuestion = 'Patterns of behaviours'

  describe(question, () => {
    const options = ['Yes', 'No']

    it(`displays and validates the question`, () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint('Include repeated circumstances or behaviours.')
        .hasRadios(options)
        .getNextQuestion()
        .hasTitle('Give details')
        .hasLimit(1000)
        .hasHint(null)
      cy.markAsComplete()
      cy.assertStepUrlIs(summaryPage)
      cy.getQuestion(question).hasValidationError('Select if there are any patterns of behaviours')
      cy.checkAccessibility()
    })

    it('"Give details" is optional when selecting "No"', () => {
      cy.getQuestion(question).getRadio('No').clickLabel()
      cy.markAsComplete()
      cy.getQuestion(question).hasNoValidationError().getNextQuestion().hasTitle('Give details').hasNoValidationError()
      cy.visitStep(analysisCompletePage)
      cy.get('#tab_practitioner-analysis').click()
      cy.getAnalysisSummary(summaryQuestion).getAnalysisAnswer('No').hasNoSecondaryAnswer()
      cy.checkAccessibility()
      cy.getAnalysisSummary(summaryQuestion).clickChangeAnalysis()
      cy.assertStepUrlIs(summaryPage)
      cy.getQuestion(question)
    })

    it('"Give details" is required when selecting "Yes"', () => {
      cy.getQuestion(question).getRadio('Yes').clickLabel()
      cy.markAsComplete()
      cy.getQuestion(question)
        .hasNoValidationError()
        .getNextQuestion()
        .hasTitle('Give details')
        .hasValidationError('Enter details')
        .enterText('some details')
      cy.checkAccessibility()
      cy.markAsComplete()
      cy.getQuestion(question).hasNoValidationError().getNextQuestion().hasTitle('Give details').hasNoValidationError()
      cy.visitStep(analysisCompletePage)
      cy.get('#tab_practitioner-analysis').click()
      cy.getAnalysisSummary(summaryQuestion).getAnalysisAnswer('Yes').hasSecondaryAnalysisAnswer('some details')
      cy.checkAccessibility()
      cy.getAnalysisSummary(summaryQuestion).clickChangeAnalysis()
      cy.assertStepUrlIs(summaryPage)
      cy.getQuestion(question)
    })
  })
}
