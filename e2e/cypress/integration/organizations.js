describe('Organization', () => {
    before(() => {
        cy.login('cypress-user', 'cypress-user-password')
    })
    beforeEach(() => {
        //Cypress.Cookies.preserveOnce('auth_tkt', 'ckan')
    })
    after(() => {
        cy.delete_organization('cypress-test-org')
    })
    it('Create Organization', () => {
        //cy.visit('/organization/new')
        //cy.get('#field-name').type('cypress-test-org')
        // cy.screenshot()
        //cy.get('#field-description').type('cypress test description')
        // cy.screenshot()
        //cy.get('form').should('contain', 'Create Organization').submit()
        // cy.screenshot()

        // Organization creation not working, using API
        //cy.delete_organization('cypress-test-org')
        cy.create_organization('cypress-test-org', 'cypress-test-org', 'cypress test description')
        cy.visit('/organization')
        cy.screenshot()

        // cy.location('pathname').should('eq', '/organization/cypress-test-org')
    })
})