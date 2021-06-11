describe('Create Organization', () => {
    before(() => {
        cy.login('cypress-user', 'cypress-user-password')
    })
    beforeEach(() => {
        Cypress.Cookies.preserveOnce('auth_tkt', 'ckan')
    })
    it('Create Organization', () => {
        cy.visit('/organization/new')
        cy.get('#field-name').type('cypress-test-org')
        cy.screenshot()
        cy.get('#field-description').type('cypress test description')
        cy.screenshot()
        cy.get('form').should('contain', 'Create Organization').submit()
        cy.screenshot()
        cy.visit('/organization/cypress-test-org')
    })
})