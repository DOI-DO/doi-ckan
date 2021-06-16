describe('Organization', () => {
    before(() => {
        cy.login('cypress-user', 'cypress-user-password')
    })
    beforeEach(() => {
        //Cypress.Cookies.preserveOnce('auth_tkt', 'ckan')
    })
    after(() => {
        // cy.delete_organization('cypress-test-org')
    })
    it('Create Organization', () => {
        cy.create_organization('cypress-test-org', 'cypress-test-org', 'cypress test description')
        cy.screenshot()
        cy.visit('/organization/cypress-test-org')
        cy.screenshot()
    })
})