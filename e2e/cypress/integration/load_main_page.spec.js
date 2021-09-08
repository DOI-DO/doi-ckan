it('Load main page and environment config', () => {
    cy.visit('/dataset')
    cy.contains('Search for and discover data from across the Department of the Interior')
});