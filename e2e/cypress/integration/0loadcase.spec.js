it('loads page', () => {
    cy.visit('/dataset')
    cy.contains('No datasets')
});